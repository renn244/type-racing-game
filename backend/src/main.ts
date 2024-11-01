import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.useStaticAssets(join(__dirname, '../../backend', 'uploads/'), {
    prefix: '/Uploads'
  })

  app.enableCors({ 
    origin: 'http://localhost:5173',
    credentials: true
  })

  await app.listen(5000);
}
bootstrap();
