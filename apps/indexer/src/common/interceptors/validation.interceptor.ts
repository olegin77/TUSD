import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ValidationPipe } from '@nestjs/common';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  private validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { body, query, params } = request;

    try {
      // Validate request body
      if (body && Object.keys(body).length > 0) {
        await this.validationPipe.transform(body, {
          type: 'body',
          metatype: Object.getPrototypeOf(body).constructor,
        });
      }

      // Validate query parameters
      if (query && Object.keys(query).length > 0) {
        await this.validationPipe.transform(query, {
          type: 'query',
          metatype: Object.getPrototypeOf(query).constructor,
        });
      }

      // Validate route parameters
      if (params && Object.keys(params).length > 0) {
        await this.validationPipe.transform(params, {
          type: 'param',
          metatype: Object.getPrototypeOf(params).constructor,
        });
      }
    } catch (error) {
      throw new BadRequestException('Validation failed', error.message);
    }

    return next.handle();
  }
}
