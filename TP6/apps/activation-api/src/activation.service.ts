import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import pc from 'picocolors';
import { ActivationGateway } from './activation.gateway.js';

// * =========================================================================
// * ARQUITECTURA SAGA: COREOGRAFÍA CON AGREGADOR (KAFKA KRaft + MONGO OUTBOX)
// * =========================================================================
// ? ¿Por qué Coreografía con Agregador y no un Orquestador Centralizado monolítico?
// * 1. Desacoplamiento total: Los microservicios (billing, provisioning) NO se conocen
// *    entre sí ni conocen quién inició la solicitud; solo consumen y emiten en Kafka.
// * 2. Escalabilidad independiente: Cada servicio escala en su propio Consumer Group
// *    según la cantidad de particiones asignadas por clave de partición (customerId).
// * 3. activation-api actúa como Agregador de la Saga: Escucha los resultados y evalúa
// *    la condición terminal: Si ambos confirman OK -> ACTIVE; ante el primer fallo -> FAILED
// *    y se emite la orden de compensación (Rollback) por Kafka.
// * =========================================================================

@Injectable()
export class ActivationService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_CLIENT')     private kafkaClient: ClientKafka,
    @InjectModel('Activation')  private activationModel: Model<any>,
    @InjectModel('Outbox')      private outboxModel: Model<any>,
    private readonly gateway:   ActivationGateway
  ) {}

  private now(): string {
    return new Date().toLocaleTimeString('es-AR', { hour12: false });
  }

  private logStep(tag: string, message: string, colorFn: (s: string) => string = pc.cyan) {
    const time = pc.dim(this.now());
    const badge = colorFn(`[${tag.padEnd(9)}]`);
    console.log(`  ${time}  ${badge}  ${message}`);
  }

  async onModuleInit() {
    try {
      await this.kafkaClient.connect();
      console.log(`  ${pc.dim(this.now())}  ${pc.green(pc.bold('[KAFKA]   '))}  Broker KRaft conectado en ${pc.cyan('localhost:9092')}`);
    } catch (err) {
      console.error(pc.red(`  ${this.now()}  [KAFKA-ERR]  Error conectando a Kafka:`), err);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BANNER DE ESCENARIO ELEGANTE Y COMPACTO
  // ─────────────────────────────────────────────────────────────────────────
  private printScenarioBanner(scenario: number, customerId: string, planId: string) {
    const banners: Record<number, { title: string; subtitle: string; concept: string; color: (s: string) => string }> = {
      1: {
        title: 'ESCENARIO 1: CAMINO FELIZ (FAN-OUT KAFKA)',
        subtitle: 'Ambos microservicios (Billing y Provisioning) responden con éxito.',
        concept: 'Fan-out: 1 evento de negocio encolado genera N reacciones autónomas.',
        color: pc.green,
      },
      2: {
        title: 'ESCENARIO 2: FALLO Y COMPENSACIÓN (SAGA ROLLBACK)',
        subtitle: 'Provisioning falla; Agregador ordena a Billing anular la cuenta.',
        concept: 'Saga Compensatoria: Consistencia eventual sin 2PC ni llamadas HTTP.',
        color: pc.yellow,
      },
      3: {
        title: 'ESCENARIO 3: RESILIENCIA Y RECUPERACIÓN (CONSUMER LAG)',
        subtitle: 'Simulación de consumidor offline; los mensajes quedan retenidos en topic.',
        concept: 'Offsets: Kafka retiene el log inmutable; cero pérdida al reconectar.',
        color: pc.magenta,
      },
      4: {
        title: 'ESCENARIO 4: ESCALABILIDAD HORIZONTAL (CONSUMER GROUPS)',
        subtitle: 'Balanceo dinámico de particiones entre múltiples réplicas del servicio.',
        concept: 'Particiones = Unidad de paralelismo dentro del mismo Consumer Group.',
        color: pc.cyan,
      },
      5: {
        title: 'ESCENARIO 5: NUEVO CONSUMIDOR RETROACTIVO (LOG REPLAY)',
        subtitle: 'Servicio nuevo (Loyalty) procesando histórico desde offset = 0.',
        concept: 'Replay: auto.offset.reset = earliest sin afectar consumidores en vivo.',
        color: pc.blue,
      },
    };

    const b = banners[scenario] || {
      title: 'ESCENARIO DE ACTIVACIÓN ESTÁNDAR',
      subtitle: 'Ejecución del pipeline de eventos Kafka.',
      concept: 'Arquitectura dirigida por eventos (EDA).',
      color: pc.cyan,
    };

    const boxWidth = 70;
    const border = '─'.repeat(boxWidth);

    console.log('\n' + pc.dim('┌' + border + '┐'));
    console.log(pc.dim('│ ') + b.color(pc.bold(b.title)));
    console.log(pc.dim('│ ') + pc.white(b.subtitle));
    console.log(pc.dim('│ ') + pc.dim('Concepto : ') + pc.yellow(b.concept));
    console.log(pc.dim('│ ') + pc.dim('Paráms   : ') + pc.cyan(`Cliente: ${customerId}`) + pc.dim(' │ ') + pc.cyan(`Plan: ${planId}`));
    console.log(pc.dim('└' + border + '┘\n'));
  }

  private emitKafkaAndWS(
    topic: string,
    event: any,
    tag: string,
    message: string,
    colorFn: (s: string) => string = pc.cyan
  ) {
    // 1. Emitimos a Kafka real con clave de partición por cliente
    this.kafkaClient.emit(topic, {
      key: event.customerId,
      value: event,
    }).subscribe({
      error: (e) => console.error(pc.red(`  ${this.now()}  [KAFKA-ERR]  Error en topic [${topic}]:`), e),
    });

    // 2. Notificamos al frontend en tiempo real vía WebSocket
    this.gateway.emitEvent(event);

    // 3. Log nítido formateado en consola
    this.logStep(tag, message, colorFn);
  }

  private delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MÉTODO PRINCIPAL: INICIO DE ACTIVACIÓN (OUTBOX + FAN-OUT)
  // ─────────────────────────────────────────────────────────────────────────
  // param customerId: Identificador del cliente (clave de partición en Kafka)
  // param planId: Plan contratado
  // param simulateFailure: 'none' | 'billing' | 'provisioning'
  // param scenario: Número de escenario (1 a 5)
  async createActivation(
    customerId: string,
    planId: string,
    simulateFailure: string = 'none',
    scenario: number = 1
  ) {
    this.printScenarioBanner(scenario, customerId, planId);

    const activationId = crypto.randomUUID();
    const eventId = crypto.randomUUID();

    // * =====================================================================
    // * 1. PATRÓN TRANSACTIONAL OUTBOX (Solución al Dual-Write Problem)
    // * =====================================================================
    // ! Si guardamos en Mongo y luego el proceso muere antes de publicar en Kafka,
    // ! la activación quedaría en el limbo sin notificar a la red.
    // * Solución: El estado del negocio (PENDING) y el mensaje a publicar se guardan
    // * dentro de la MISMA transacción ACID en MongoDB.
    const session = await this.activationModel.db.startSession();
    session.startTransaction();

    try {
      const activation = new this.activationModel({
        _id: activationId,
        customerId,
        planId,
        status: 'PENDING',
        simulateFailure,
        steps: {},
        history: [],
      });

      const eventPayload = {
        eventId,
        eventType: 'ActivationRequested',
        version: 1,
        occurredAt: new Date().toISOString(),
        correlationId: activationId,
        customerId,
        source: 'activation-api',
        payload: { planId, simulateFailure, channel: 'web', scenario },
      };

      await activation.save({ session });

      await new this.outboxModel({
        eventId,
        topic: 'activation.requested',
        payload: eventPayload,
        status: 'PENDING',
      }).save({ session });

      await session.commitTransaction();

      this.logStep('OUTBOX', 'Transacción ACID confirmada en Mongo (Doc + Evento)', pc.magenta);

      // * =====================================================================
      // * 2. DISPARO DEL FAN-OUT EN KAFKA
      // * =====================================================================
      this.emitKafkaAndWS(
        'activation.requested',
        eventPayload,
        'FAN-OUT',
        `Publicado '${pc.bold('ActivationRequested')}' → topic: activation.requested (key: ${customerId})`,
        pc.cyan
      );

      // * 3. Ejecución simulada de los microservicios de la Saga
      this.simulateSagaExecution(activationId, customerId, simulateFailure, scenario);

      return { activationId, status: 'PENDING' };
    } catch (err) {
      await session.abortTransaction();
      console.error(pc.red(`  ${this.now()}  [OUTBOX-ERR] Error en transacción atómica:`), err);
      throw err;
    } finally {
      session.endSession();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SIMULACIÓN DE MICROSERVICIOS Y PATRÓN SAGA
  // ─────────────────────────────────────────────────────────────────────────
  private async simulateSagaExecution(
    correlationId: string,
    customerId: string,
    simulateFailure: string,
    scenario: number = 1
  ) {
    if (scenario === 3) {
      this.logStep('LAG-SIM', pc.magenta('Simulación: Consumidor offline temporalmente (Lag acumulado)'), pc.magenta);
      await this.delay(700);
      this.logStep('LAG-SYNC', pc.magenta('Consumidor reconectado: procesando backlog desde offsets'), pc.magenta);
    } else if (scenario === 4) {
      this.logStep('BALANCE', pc.cyan(`Key '${customerId}' asignada a partición de Consumer Group`), pc.cyan);
    } else if (scenario === 5) {
      this.logStep('REPLAY', pc.blue('Consumidor retroactivo (Loyalty) leyendo histórico desde offset = 0'), pc.blue);
    }

    // ── Paso 1: Billing Service procesa (latencia simulada: 1.4s) ───────────
    await this.delay(1400);

    if (simulateFailure === 'billing') {
      const billingFailEvent = {
        eventId: crypto.randomUUID(),
        eventType: 'BillingFailed',
        occurredAt: new Date().toISOString(),
        correlationId,
        customerId,
        source: 'billing-service',
        payload: { reason: 'Tarjeta de crédito rechazada / Fondos insuficientes' },
      };
      this.emitKafkaAndWS(
        'billing.events',
        billingFailEvent,
        'BILLING',
        `Fallo: Tarjeta rechazada / Fondos insuficientes → topic: billing.events`,
        pc.red
      );
      await this.handleServiceResult(correlationId, 'billing', 'FAILED');
      return;
    }

    const billingOkEvent = {
      eventId: crypto.randomUUID(),
      eventType: 'BillingAccountCreated',
      occurredAt: new Date().toISOString(),
      correlationId,
      customerId,
      source: 'billing-service',
      payload: { accountId: `ACC-${Date.now().toString().slice(-6)}`, status: 'CREATED' },
    };
    this.emitKafkaAndWS(
      'billing.events',
      billingOkEvent,
      'BILLING',
      `Cuenta creada (${billingOkEvent.payload.accountId}) → topic: billing.events`,
      pc.yellow
    );
    await this.handleServiceResult(correlationId, 'billing', 'OK');

    // ── Paso 2: Provisioning Service procesa (latencia simulada: 1.8s) ───────
    await this.delay(1800);

    if (simulateFailure === 'provisioning') {
      const provFailEvent = {
        eventId: crypto.randomUUID(),
        eventType: 'ProvisioningFailed',
        occurredAt: new Date().toISOString(),
        correlationId,
        customerId,
        source: 'provisioning-service',
        payload: { reason: 'Sin puertos disponibles en la central telefónica (Capacidad agotada)' },
      };
      this.emitKafkaAndWS(
        'provisioning.events',
        provFailEvent,
        'PROVISION',
        `Fallo: Central telefónica saturada → topic: provisioning.events`,
        pc.red
      );
      await this.handleServiceResult(correlationId, 'provisioning', 'FAILED');

      // Compensación Saga
      await this.delay(1200);
      const compensationEvent = {
        eventId: crypto.randomUUID(),
        eventType: 'BillingAccountCancelled',
        occurredAt: new Date().toISOString(),
        correlationId,
        customerId,
        source: 'billing-service',
        payload: { reason: 'Compensación de Saga: rollback por fallo en aprovisionamiento' },
      };
      this.emitKafkaAndWS(
        'billing.events',
        compensationEvent,
        'ROLLBACK',
        `Compensación: Cuenta preliminar anulada en Billing (Consistencia Eventual)`,
        pc.yellow
      );
      return;
    }

    const provOkEvent = {
      eventId: crypto.randomUUID(),
      eventType: 'ProvisioningCompleted',
      occurredAt: new Date().toISOString(),
      correlationId,
      customerId,
      source: 'provisioning-service',
      payload: { resourceId: `RES-${Date.now().toString().slice(-6)}`, speed: '1000Mbps' },
    };
    this.emitKafkaAndWS(
      'provisioning.events',
      provOkEvent,
      'PROVISION',
      `Servicio configurado (${provOkEvent.payload.resourceId}) → topic: provisioning.events`,
      pc.blue
    );
    await this.handleServiceResult(correlationId, 'provisioning', 'OK');

    // ── Paso 3: Notification Service (email a Mailhog) ─────────────────────
    await this.delay(800);
    const notifEvent = {
      eventId: crypto.randomUUID(),
      eventType: 'NotificationSent',
      occurredAt: new Date().toISOString(),
      correlationId,
      customerId,
      source: 'notification-service',
      payload: {
        to: `${customerId.toLowerCase()}@fibertel.com.ar`,
        template: 'BIENVENIDA_FLOW',
        mailhogUrl: 'http://localhost:8025',
      },
    };
    this.emitKafkaAndWS(
      'activation.events',
      notifEvent,
      'NOTIFY',
      `Notificación despachada → MailHog (:8025) a ${notifEvent.payload.to}`,
      pc.green
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // AGREGADOR DE SAGA: EVALUACIÓN DE ESTADO TERMINAL
  // ─────────────────────────────────────────────────────────────────────────
  async handleServiceResult(correlationId: string, serviceName: string, status: 'OK' | 'FAILED') {
    const activation = await this.activationModel.findById(correlationId);
    if (!activation) return;

    // Control de idempotencia
    if (activation.status === 'ACTIVE' || activation.status === 'FAILED') {
      this.logStep('IDEMPOTENT', `Saga ${correlationId.slice(0, 8)} ya finalizada (${activation.status}). Descartando duplicado.`, pc.dim);
      return;
    }

    activation.steps[serviceName] = { status, at: new Date().toISOString() };

    if (status === 'FAILED') {
      activation.status = 'FAILED';
      const failEvent = {
        eventId: crypto.randomUUID(),
        eventType: 'ActivationFailed',
        occurredAt: new Date().toISOString(),
        correlationId,
        customerId: activation.customerId,
        source: 'activation-api',
        payload: { failedService: serviceName, triggerCompensation: true },
      };
      this.emitKafkaAndWS(
        'activation.events',
        failEvent,
        'SAGA-FAIL',
        pc.bold(pc.red('Saga FAILED: Activación en fallo. Disparando compensaciones.')),
        pc.red
      );
    } else if (activation.steps.billing?.status === 'OK' && activation.steps.provisioning?.status === 'OK') {
      activation.status = 'ACTIVE';
      const completedEvent = {
        eventId: crypto.randomUUID(),
        eventType: 'ActivationCompleted',
        occurredAt: new Date().toISOString(),
        correlationId,
        customerId: activation.customerId,
        source: 'activation-api',
        payload: { finalStatus: 'ACTIVE', activatedAt: new Date().toISOString() },
      };
      this.emitKafkaAndWS(
        'activation.events',
        completedEvent,
        'SAGA-OK',
        pc.bold(pc.green('Saga COMPLETADA: Billing OK + Provisioning OK → Activación ACTIVE')),
        pc.green
      );
    }

    await activation.save();
  }
}
