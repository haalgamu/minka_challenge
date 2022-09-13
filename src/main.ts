import { ValidationPipe } from '@nestjs/common';
import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createSQSConsumer } from './aws/sqs-comsumer.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('ZEF Application')
    .setDescription(
      'The ZEF API description. The credentials to owner are: (owner@zef.com, password)',
    )
    .setVersion('1.0')
    .addBearerAuth({
      description: 'Default JWT Authorization',
      type: 'http',
      in: 'header',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(parseInt(process.env.APP_PORT) || 4000);

  console.log(`Application is running on: ${await app.getUrl()}`);

  const sqsConsumer = await createSQSConsumer();
  sqsConsumer.start();
}
bootstrap();
