import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './orders/helpers/transform.interceptor';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors(
    {
      credentials: true,
      origin: ['http://localhost:3000'], //''https://url-production'', 
   }
  );


  app.use(helmet());
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1/');

  const config = new DocumentBuilder()
    .setTitle('FastBuy Api')
    .setDescription('Ecommerce Api build Nestjs')
    .setVersion('1.0')
    .addTag('ecommerce')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalInterceptors(new TransformInterceptor());

 

  await app.listen(process.env.PORT || 8000);
}

bootstrap(); 
