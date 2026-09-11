import { PaymentsService } from './payments.service.js';
import { PaymentSessionDto } from './dto/payment-session.dto.js';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPaymentSession(paymentSessionDto: PaymentSessionDto): Promise<{
        id: string;
        url: string | null;
        cancel_url: string | null;
        success_url: string | null;
    }>;
    success(): {
        ok: boolean;
        message: string;
    };
    cancel(): {
        ok: boolean;
        message: string;
    };
    stripeWebhook(req: any, res: any): any;
}
