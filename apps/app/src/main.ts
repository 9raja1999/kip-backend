import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.APP_PORT || 3000;

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Validation Pipess
  app.useGlobalPipes(createValidationPipe());

  await app.listen(port);
}
bootstrap();
