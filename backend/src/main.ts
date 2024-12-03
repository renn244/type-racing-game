import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AllExceptionFilter } from './AllExceptionsFilter ';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix('/api')
  // be careful with the path here, it should be relative to the dist folder
  // look at the name in docker-compose.yml
  // app for docker and backend for localhost
  app.useStaticAssets(join(__dirname, '../', 'uploads/'), {
    prefix: '/api/Uploads'
  })
  app.useGlobalFilters(new AllExceptionFilter());

  app.enableCors({ 
    origin: process.env.BASE_CLIENT_URL,
    credentials: true
  })

  const port = process.env.PORT || 5000
  await app.listen(5000);
}
bootstrap();
