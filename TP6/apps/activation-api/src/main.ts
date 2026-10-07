import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import pc from 'picocolors';

async function bootstrap() {
  // * Creamos la app HTTP pura (sin microservicio Kafka consumidor).
  // ? ¿Por qué no levantamos el consumidor Kafka aquí?
  // * Porque los microservicios (billing, provisioning) se simulan dentro
  // * de activation-api para la demo. En producción, cada uno sería un proceso
  // * NestJS independiente con su propio main.ts y consumer group.
  const app = await NestFactory.create(AppModule);

  // * CORS habilitado para que el frontend Next.js (puerto 5173) se comunique.
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);

  const boxWidth = 56;
  const line = '─'.repeat(boxWidth);

  console.log('\n' + pc.dim('┌' + line + '┐'));
  console.log(pc.dim('│ ') + pc.bold('Activation API') + pc.dim(' (EDA Saga Coreografía)'));
  console.log(pc.dim('│ ') + pc.dim('  HTTP Server   : ') + pc.cyan('http://localhost:3000'));
  console.log(pc.dim('│ ') + pc.dim('  Kafka Broker  : ') + pc.cyan('localhost:9092 (KRaft)'));
  console.log(pc.dim('│ ') + pc.dim('  MongoDB       : ') + pc.cyan('localhost:27017 (ReplSet)'));
  console.log(pc.dim('│ ') + pc.dim('  Frontend      : ') + pc.cyan('http://localhost:5173'));
  console.log(pc.dim('└' + line + '┘\n'));
}
bootstrap();
