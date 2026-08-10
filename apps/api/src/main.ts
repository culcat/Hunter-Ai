import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('AI Job Search Backend API')
    .setDescription('NestJS + TypeORM + SQLite RESTful API for AI Job Search Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication & User session')
    .addTag('resumes', 'PDF resume parsing & structured profile editing')
    .addTag('vacancies', 'Vacancy parsing, scraping, and multi-field filtering')
    .addTag('ai-match', 'AI Match evaluation & skill alignment analysis')
    .addTag('cover-letters', 'Multi-variant cover letter generator')
    .addTag('applications', 'Kanban applications pipeline & job favorites')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API server is running on http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
