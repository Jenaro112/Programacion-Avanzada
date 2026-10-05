import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // * Creamos la app HTTP pura (sin microservicio Kafka consumidor).
  // ? ¿Por qué no levantamos el consumidor Kafka aquí?
  // * Porque los microservicios (billing, provisioning) se simulan dentro
  // * de activation-api para la demo. En producción, cada uno sería un proceso
  // * NestJS independiente con su propio main.ts y consumer group.
  const app = await NestFactory.create(AppModule);

  // * CORS habilitado para que el frontend Next.js (puerto 5173) se comunique.
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);

  logger.log(`\n${'═'.repeat(60)}`);
  logger.log(`🚀 Activation-API corriendo en http://localhost:3000`);
  logger.log(`📡 Kafka Producer conectado a 127.0.0.1:9092`);
  logger.log(`💾 MongoDB conectado a 127.0.0.1:27017`);
  logger.log(`🖥️  Frontend en http://localhost:5173`);
  logger.log(`${'═'.repeat(60)}\n`);
}
bootstrap();
