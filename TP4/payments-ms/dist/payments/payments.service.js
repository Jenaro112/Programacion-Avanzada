var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { envs } from '../config/envs.js';
import Stripe from 'stripe';
let PaymentsService = class PaymentsService {
    stripe = new Stripe(envs.stripeSecret);
    async createPaymentSession(paymentSessionDto) {
        const { currency, items, orderId } = paymentSessionDto;
        const lineItems = items.map((item) => {
            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.price * 100),
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
    stripeWebhook(req, res) {
        const signature = req.headers['stripe-signature'];
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(req['rawBody'], signature, envs.stripeEndpointSecret);
        }
        catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        switch (event.type) {
            case 'charge.succeeded':
                const chargeSucceeded = event.data.object;
                const orderId = chargeSucceeded.metadata?.orderId;
                console.log(`Pago recibido y exitoso. Order ID: ${orderId}`);
                break;
            default:
                console.log(`Evento de Stripe no manejado: ${event.type}`);
        }
        return res.status(200).send({ sig: 'ok' });
    }
};
PaymentsService = __decorate([
    Injectable()
], PaymentsService);
export { PaymentsService };
//# sourceMappingURL=payments.service.js.map