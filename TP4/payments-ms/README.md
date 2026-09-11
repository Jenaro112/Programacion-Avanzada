# Payments Microservice - TP4

Microservicio en NestJS para la integración con Stripe (Creación de sesión y Webhooks).

## Cómo levantar el proyecto

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno:
   Copiar el archivo `.env.template` y renombrarlo a `.env`. Luego, completar con las claves de prueba de Stripe:
   ```env
   PORT=3003
   STRIPE_SECRET=sk_test_...
   STRIPE_SUCCESS_URL=http://localhost:3003/payments/success
   STRIPE_CANCEL_URL=http://localhost:3003/payments/cancel
   STRIPE_ENDPOINT_SECRET=whsec_...
   ```

3. Iniciar el servidor (desarrollo):
   ```bash
   npm run start:dev
   ```

## Rutas Principales

### 1. Crear sesión de pago
**POST** `/payments/create-payment-session`
Cuerpo (JSON):
```json
{
  "orderId": "ord-1",
  "currency": "usd",
  "items": [
    { "name": "Producto de prueba", "price": 20, "quantity": 1 }
  ]
}
```
*Devuelve el `id` y la `url` para redirigir al Checkout de Stripe.*

### 2. Webhook de Stripe
**POST** `/payments/webhook`
- Ruta interna que recibe eventos de Stripe (como `charge.succeeded`).
- Requiere ejecutar Stripe CLI en local: `stripe listen --forward-to localhost:3003/payments/webhook`

### 3. Rutas de apoyo
- **GET** `/payments/success`: Redirección tras pago exitoso.
- **GET** `/payments/cancel`: Redirección tras pago cancelado.
