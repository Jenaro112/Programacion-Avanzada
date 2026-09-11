import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { rawBody: true });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    await app.listen(envs.port);
    console.log(`Payments microservice running on port ${envs.port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map