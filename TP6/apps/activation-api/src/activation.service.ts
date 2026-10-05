import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
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
  private readonly logger = new Logger('KAFKA-SAGA');

  constructor(
    @Inject('KAFKA_CLIENT')     private kafkaClient: ClientKafka,
    @InjectModel('Activation')  private activationModel: Model<any>,
    @InjectModel('Outbox')      private outboxModel: Model<any>,
    private readonly gateway:   ActivationGateway
  ) {}

  async onModuleInit() {
    this.logger.log('Conectando cliente Kafka Producer (KRaft broker 127.0.0.1:9092)...');
    try {
      await this.kafkaClient.connect();
      this.logger.log('✅ Broker Kafka KRaft conectado y listo.');
    } catch (err) {
      this.logger.error('Error conectando a Kafka:', err);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BANNERS DE TERMINAL NÍTIDOS Y PROFESIONALES
  // ─────────────────────────────────────────────────────────────────────────
  // ! Diseñado para NO romperse con los prefijos de timestamp de NestJS.
  // ! Usa formato de bloque compacto con separadores sólidos y alineación clara.
  private printScenarioBanner(scenario: number, customerId: string, planId: string) {
    const banners: Record<number, { title: string; subtitle: string; concept: string }> = {
      1: {
        title: '🟢 ESCENARIO 1: CAMINO FELIZ (FAN-OUT KAFKA)',
        subtitle: 'Ambos microservicios (Billing y Provisioning) responden con éxito.',
        concept: 'Fan-out: 1 evento de negocio encolado genera N reacciones autónomas.',
      },
      2: {
        title: '🟠 ESCENARIO 2: FALLO Y COMPENSACIÓN (SAGA ROLLBACK)',
        subtitle: 'Provisioning falla; el Agregador ordena a Billing anular la cuenta creada.',
        concept: 'Saga Compensatoria: Consistencia eventual sin 2PC ni llamadas HTTP directas.',
      },
      3: {
        title: '🔴 ESCENARIO 3: RESILIENCIA Y RECUPERACIÓN (CONSUMER LAG)',
        subtitle: 'Simulación de consumidor offline; los mensajes quedan retenidos en el topic.',
        concept: 'Offsets: Kafka retiene el log inmutable; cero pérdida de mensajes al reconectar.',
      },
      4: {
        title: '⚖️  ESCENARIO 4: ESCALABILIDAD HORIZONTAL (CONSUMER GROUPS)',
        subtitle: 'Balanceo dinámico de particiones entre múltiples réplicas de un servicio.',
        concept: 'Particiones = Unidad de paralelismo dentro del mismo Consumer Group.',
      },
      5: {
        title: '⏪ ESCENARIO 5: NUEVO CONSUMIDOR RETROACTIVO (LOG REPLAY)',
        subtitle: 'Servicio nuevo (Loyalty) procesando histórico desde offset = 0.',
        concept: 'Replay: auto.offset.reset = earliest sin afectar a los consumidores en vivo.',
      },
    };

    const b = banners[scenario] || {
      title: '🔵 ESCENARIO DE ACTIVACIÓN ESTÁNDAR',
      subtitle: 'Ejecución del pipeline de eventos Kafka.',
      concept: 'Arquitectura dirigida por eventos (EDA).',
    };

    const sep = '═'.repeat(74);
    console.log('\n' + sep);
    console.log(`  ${b.title}`);
    console.log(`  Subtítulo : ${b.subtitle}`);
    console.log(`  Concepto  : ${b.concept}`);
    console.log(`  Parámetros: Cliente=${customerId} | Plan=${planId}`);
    console.log(sep + '\n');
  }

  private emitKafkaAndWS(topic: string, event: any, label: string) {
    // 1. Emitimos a Kafka real
    this.kafkaClient.emit(topic, event).subscribe({
      error: (e) => this.logger.error(`Error emitiendo a Kafka [${topic}]:`, e),
    });

    // 2. Notificamos al frontend en tiempo real vía WebSocket
    this.gateway.emitEvent(event);

    // 3. Log nítido en consola
    this.logger.log(label);
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

      this.logger.log(`[OUTBOX]      💾 Transacción ACID confirmada en Mongo (Doc + Evento encolado)`);

      // * =====================================================================
      // * 2. DISPARO DEL FAN-OUT EN KAFKA
      // * =====================================================================
      // * customerId se usa como clave de mensaje (key). Kafka garantiza que todos
      // * los eventos de este cliente caen en la MISMA partición, preservando orden.
      this.emitKafkaAndWS(
        'activation.requested',
        eventPayload,
        `[FAN-OUT]     📡 Publicado 'ActivationRequested' -> Topic: activation.requested (Key: ${customerId})`
      );

      // * 3. Ejecución simulada de los microservicios de la Saga
      this.simulateSagaExecution(activationId, customerId, simulateFailure);

      return { activationId, status: 'PENDING' };
    } catch (err) {
      await session.abortTransaction();
      this.logger.error(`❌ [OUTBOX-FAIL] Error en transacción atómica:`, err);
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
    simulateFailure: string
  ) {
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
        `[BILLING]     ❌ ERROR: Tarjeta rechazada. Publicando BillingFailed -> Topic: billing.events`
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
      `[BILLING]     🏦 Cuenta creada (${billingOkEvent.payload.accountId}) -> Topic: billing.events`
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
        `[PROVISION]   ❌ ERROR: Central saturada. Publicando ProvisioningFailed -> Topic: provisioning.events`
      );
      await this.handleServiceResult(correlationId, 'provisioning', 'FAILED');

      // * ===================================================================
      // * 3. COMPENSACIÓN SAGA (Rollback Eventual)
      // * ===================================================================
      // ! Billing ya creó la cuenta previamente. Dado que Provisioning falló,
      // ! el sistema no puede quedar inconsistente. Billing escucha 'ActivationFailed'
      // ! y ejecuta su transacción compensatoria: ANULA LA CUENTA.
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
        `[COMPENSATE]  🔄 ROLLBACK: Billing anuló la cuenta preliminar -> Consistencia Eventual Garantizada`
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
      `[PROVISION]   ⚙️  Servicio aprovisionado (${provOkEvent.payload.resourceId}) -> Topic: provisioning.events`
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
      `[NOTIFY]      📧 Email de bienvenida despachado -> Mailhog (:8025) para ${notifEvent.payload.to}`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // AGREGADOR DE SAGA: EVALUACIÓN DE ESTADO TERMINAL
  // ─────────────────────────────────────────────────────────────────────────
  async handleServiceResult(correlationId: string, serviceName: string, status: 'OK' | 'FAILED') {
    const activation = await this.activationModel.findById(correlationId);
    if (!activation) return;

    // * CONTROL DE IDEMPOTENCIA
    // ! Kafka es At-least-once. Si llega un mensaje duplicado a una saga ya cerrada,
    // ! se descarta inmediatamente sin producir efectos colaterales.
    if (activation.status === 'ACTIVE' || activation.status === 'FAILED') {
      this.logger.debug(`[IDEMPOTENT] Saga ${correlationId.slice(0, 8)} ya está ${activation.status}. Descartando.`);
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
        `[SAGA-END]    🚨 SAGA FALLIDA: Activación pasó a FAILED. Disparando compensaciones.`
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
        `[SAGA-END]    🎉 SAGA COMPLETADA: Billing OK + Provisioning OK -> Activación ACTIVE.`
      );
    }

    await activation.save();
  }
}
