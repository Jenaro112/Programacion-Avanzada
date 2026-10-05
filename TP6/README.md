# 🚀 Kafka Saga Orchestrator & Premium UI

Este proyecto es una demostración avanzada de **Arquitectura Orientada a Eventos (EDA)** implementando el **Patrón Saga** y el **Patrón Outbox**, visualizado en tiempo real a través de una interfaz gráfica de altísima calidad (Premium UI / Motion Primitives).

## 🏗 Arquitectura del Sistema

El sistema simula un flujo de activación de servicios de telecomunicaciones (Ej: Fibertel/Flow), donde múltiples microservicios reaccionan a eventos de manera asíncrona y distribuida.

### Tecnologías Core
- **Frontend:** Next.js / React, TailwindCSS, GSAP (Animaciones de grado Awwwards, Morphing, Clip-Paths).
- **Backend:** NestJS, KafkaJS, WebSockets (Socket.io).
- **Base de Datos:** MongoDB (Transacciones ACID para el patrón Outbox).
- **Mensajería:** Apache Kafka (Modo KRaft) + Kafka UI.
- **Mailing:** Mailhog (Servidor SMTP de prueba local).

### Patrones de Diseño Implementados
1. **Saga Pattern (Coreografía):** Coordinación de transacciones distribuidas sin un orquestador central estricto. Si un servicio falla (ej. Aprovisionamiento), se emiten eventos de compensación (`BillingAccountCancelled`) para realizar un Rollback seguro y automático.
2. **Transactional Outbox:** Garantiza que la escritura en la base de datos (MongoDB) y la emisión del mensaje a Kafka ocurran de forma atómica y consistente, evitando la pérdida de eventos ante caídas de red.
3. **Fan-Out:** Un solo evento (`ActivationRequested`) es consumido paralelamente por múltiples microservicios autónomos (Billing y Provisioning) gracias a la separación por Consumer Groups.
4. **Event Sourcing (Memoria Histórica):** Capacidad de reconstruir el estado del sistema conectando un nuevo consumidor y leyendo la bitácora inmutable de Kafka desde el offset más antiguo (`earliest`).

## ⚙️ Cómo Levantar el Proyecto

### 1. Levantar la Infraestructura (Docker)
En la raíz del proyecto (`TP6`), ejecuta:
```bash
docker compose up -d
```
Esto levantará:
- **Kafka Broker:** `localhost:9092`
- **Kafka UI:** `http://localhost:8080` (Para ver topics, particiones y mensajes en vivo).
- **MongoDB:** `localhost:27017`
- **Mailhog:** `http://localhost:8025` (Para ver los correos de bienvenida interceptados).

### 2. Levantar el Backend (API NestJS)
Abre una nueva terminal en la carpeta raíz y ejecuta:
```bash
cd apps/api
npm install
npm run start:dev
```
*El backend se conectará a Kafka, inicializará los microservicios y abrirá el gateway de WebSockets en el puerto 3000.*

### 3. Levantar el Frontend (React / Vite / Next)
Abre otra terminal y ejecuta:
```bash
cd apps/demo-ui
npm install
npm run dev
```
Accede a la interfaz interactiva abriendo **http://localhost:5173** en tu navegador.

## 🎨 UI/UX Features (Motion Primitives)
- **Liquid Morphing Button:** Botón de acción magnético que muta su geometría (de círculo a píldora) y ejecuta un llenado líquido dinámico, invirtiendo el color del texto mediante un recorte espacial (Clip-Path).
- **Bitácora Reactiva en Tiempo Real:** Un *ledger* asíncrono con animaciones en cascada (`stagger`, `back.out`) que dibuja eventos sin colisiones de estado.
- **Sincronización Estricta (State Machine):** La interfaz visual no tiene contadores ciegos. El avance de la barra de progreso está atado estrictamente a la confirmación real de los eventos en la red de Kafka, cerrando el flujo únicamente al detectar las señales terminales (`NotificationSend`, `Cancelled`).
