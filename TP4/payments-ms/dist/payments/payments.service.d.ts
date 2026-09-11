import { PaymentSessionDto } from './dto/payment-session.dto.js';
export declare class PaymentsService {
    private readonly stripe;
    createPaymentSession(paymentSessionDto: PaymentSessionDto): Promise<{
        id: string;
        url: string | null;
        cancel_url: string | null;
        success_url: string | null;
    }>;
    stripeWebhook(req: any, res: any): any;
}
