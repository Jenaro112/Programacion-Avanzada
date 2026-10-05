import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ActivationService } from './activation.service.js';

@Controller('activations')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly activationService: ActivationService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async createActivation(@Body() body: { customerId: string, planId: string, simulateFailure: string, scenario: number }) {
    // * Delegamos la creación a la lógica central de la Saga en el servicio
    return this.activationService.createActivation(
      body.customerId,
      body.planId,
      body.simulateFailure,
      body.scenario
    );
  }
}
