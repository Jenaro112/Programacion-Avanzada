# Kafka Saga Orchestrator

Proyecto práctico sobre **Arquitectura Orientada a Eventos (EDA)**, utilizando los patrones **Saga** y **Transactional Outbox**. El sistema simula la activación de servicios de telecomunicaciones mediante varios microservicios que se comunican de forma asíncrona utilizando Apache Kafka.

Además, cuenta con una interfaz web para visualizar el estado del proceso y los eventos que se generan durante la ejecución.

## Arquitectura

El sistema representa un flujo de activación de servicios en el que intervienen distintos microservicios. Cada servicio procesa los eventos que le corresponden y genera nuevos eventos según el resultado de sus operaciones.

### Tecnologías

* **Frontend:** React / Next.js, TailwindCSS, GSAP
* **Backend:** NestJS, KafkaJS, WebSockets (Socket.io)
* **Base de datos:** MongoDB
* **Mensajería:** Apache Kafka en modo KRaft
* **Kafka UI:** interfaz para visualizar topics y mensajes
* **Mailing:** MailHog para pruebas de correo electrónico

## Patrones implementados

### Saga

Se utiliza una Saga basada en coreografía. No existe un componente central encargado de coordinar todas las operaciones, sino que cada microservicio reacciona a los eventos correspondientes.

Por ejemplo, si el aprovisionamiento de un servicio falla después de que se haya creado una cuenta de facturación, se genera un evento de compensación (`BillingAccountCancelled`) para deshacer la operación anterior.

### Transactional Outbox

El patrón Outbox se utiliza para mantener la consistencia entre las operaciones realizadas en MongoDB y los eventos que posteriormente se publican en Kafka.

Los eventos se almacenan junto con la operación de negocio y luego son procesados para su publicación, reduciendo el riesgo de perder mensajes cuando ocurre un error durante la comunicación con Kafka.

### Fan-Out

El evento `ActivationRequested` puede ser procesado por distintos microservicios de forma independiente.

Billing y Provisioning utilizan diferentes Consumer Groups, por lo que ambos reciben el evento y pueden ejecutar sus respectivas operaciones sin depender uno del otro.

### Lectura de eventos históricos

Kafka permite reconstruir el estado del proceso a partir de los eventos almacenados en los topics.

Para esto se puede iniciar un consumidor desde el offset `earliest` y procesar nuevamente los eventos disponibles.

## Cómo ejecutar el proyecto

### 1. Iniciar la infraestructura

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Esto inicia los siguientes servicios:

* Kafka: `localhost:9092`
* Kafka UI: `http://localhost:8080`
* MongoDB: `localhost:27017`
* MailHog: `http://localhost:8025`

Kafka UI permite consultar los topics, particiones y mensajes generados durante la ejecución.

MailHog permite visualizar los correos enviados por el sistema sin utilizar un servidor SMTP externo.

### 2. Iniciar el backend

En una terminal:

```bash
cd apps/api
npm install
npm run start:dev
```

El backend inicia la API, las conexiones con Kafka y el gateway de WebSockets utilizado para enviar actualizaciones al frontend.

### 3. Iniciar el frontend

En otra terminal:

```bash
cd apps/demo-ui
npm install
npm run dev
```

Luego acceder a:

```text
http://localhost:5173
```

## Interfaz

La interfaz permite seguir el flujo de activación mientras los distintos servicios procesan los eventos.

Entre las principales funcionalidades se encuentran:

* Ejecución del proceso de activación.
* Visualización de los eventos recibidos en tiempo real.
* Estado del proceso de Saga.
* Visualización de operaciones exitosas y compensaciones.
* Actualización del progreso a partir de los eventos recibidos desde el backend.

La interfaz utiliza GSAP para las animaciones y WebSockets para recibir las actualizaciones sin necesidad de realizar consultas periódicas al servidor.

## Flujo general

El proceso puede resumirse de la siguiente manera:

```text
ActivationRequested
        │
        ├───────────────┐
        ▼               ▼
     Billing       Provisioning
        │               │
        ▼               ▼
   BillingCreated   ServiceProvisioned
        │               │
        └───────┬───────┘
                ▼
        NotificationSend
```

En caso de que una de las operaciones falle, se generan los eventos de compensación correspondientes para revertir las operaciones que ya se habían realizado.

## Estructura principal

```text
TP6/
├── apps/
│   ├── api/
│   └── demo-ui/
├── docker-compose.yml
└── README.md
```
