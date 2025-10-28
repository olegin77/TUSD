import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';
import { initSentry } from './common/sentry/sentry.config';
import helmet from 'helmet';

async function bootstrap() {
  // Initialize Sentry first
  initSentry();

  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // Enhanced validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip non-DTO properties
      forbidNonWhitelisted: true, // Throw error if extra properties
      transform: true, // Auto-transform to DTO types
      transformOptions: {
        enableImplicitConversion: false, // Explicit conversion only
      },
      exceptionFactory: (errors) => {
        // Custom error formatting
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: errors.map((error) => ({
            field: error.property,
            constraints: error.constraints,
          })),
        });
      },
    }),
  );

  // Enhanced CORS configuration (HIGH-03 FIX)
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins =
        process.env.CORS_ALLOWED_ORIGINS?.split(',') || [
          'http://localhost:3000',
          'http://localhost:3001',
        ];

      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Wallet-Signature'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400, // 24 hours
  });

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Indexer running on port ${port}`);
  console.log(`✅ CORS configured for: ${process.env.CORS_ALLOWED_ORIGINS || 'localhost'}`);
  console.log(`✅ Security headers enabled`);
}
void bootstrap();
