import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // global middlewares
  app.use(helmet());

  // cors policy
  app.enableCors({
    origin: 'http://localhost:5000',
  });

  // swagger
  const swagger = new DocumentBuilder()
    .setTitle('nest js app api')
    .setDescription('my api app')
    .addServer('http://localhost:5000')
    .setTermsOfService('http://localhost:5000/terms-of-service')
    .setLicense('MIT license', 'google.com')
    .setVersion('1.0')
    .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
    .addBearerAuth()
    .build();
  const documentation = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, documentation);

  // running the app
  await app.listen(5000);
}

bootstrap();
