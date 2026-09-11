import { Injectable } from '@nestjs/common';
import { envs } from '../config/envs.js';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto.js';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;

    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Stripe espera centavos
        },
        quantity: item.quantity,
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId: orderId,
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });

    return {
      id: session.id,
      url: session.url,
      cancel_url: session.cancel_url,
      success_url: session.success_url,
    };
  }

  stripeWebhook(req: any, res: any) {
    const signature = req.headers['stripe-signature'];
    
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        signature,
        envs.stripeEndpointSecret,
      );
    } catch (err: any) {
      // Firma inválida, devolvemos 400
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object as Stripe.Charge;
        const orderId = chargeSucceeded.metadata?.orderId;
        console.log(`Pago recibido y exitoso. Order ID: ${orderId}`);
        break;

      default:
        console.log(`Evento de Stripe no manejado: ${event.type}`);
    }

    // Retornamos 200 para que Stripe no reintente enviar el evento
    return res.status(200).send({ sig: 'ok' });
  }
}
