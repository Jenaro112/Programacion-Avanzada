var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { PaymentSessionDto } from './dto/payment-session.dto.js';
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    createPaymentSession(paymentSessionDto) {
        return this.paymentsService.createPaymentSession(paymentSessionDto);
    }
    success() {
        return {
            ok: true,
            message: 'Payment successful',
        };
    }
    cancel() {
        return {
            ok: false,
            message: 'Payment cancelled',
        };
    }
    stripeWebhook(req, res) {
        return this.paymentsService.stripeWebhook(req, res);
    }
};
__decorate([
    Post('create-payment-session'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaymentSessionDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createPaymentSession", null);
__decorate([
    Get('success'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "success", null);
__decorate([
    Get('cancel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "cancel", null);
__decorate([
    Post('webhook'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "stripeWebhook", null);
PaymentsController = __decorate([
    Controller('payments'),
    __metadata("design:paramtypes", [PaymentsService])
], PaymentsController);
export { PaymentsController };
//# sourceMappingURL=payments.controller.js.map