import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Sentry } from './sentry.config';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SentryInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers, body } = request;

    // Add request context to Sentry
    Sentry.setContext('request', {
      method,
      url,
      headers,
      body: this.sanitizeBody(body),
    });

    return next.handle().pipe(
      tap(() => {
        // Log successful requests
        this.logger.log(`${method} ${url} - Success`);
      }),
      catchError((error) => {
        // Capture error in Sentry
        Sentry.captureException(error, {
          tags: {
            method,
            url,
            status: error.status || 500,
          },
          extra: {
            request: {
              method,
              url,
              headers,
              body: this.sanitizeBody(body),
            },
          },
        });

        // Log error
        this.logger.error(
          `${method} ${url} - Error: ${error.message}`,
          error.stack,
        );

        return throwError(() => error);
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };

    // Remove sensitive fields
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
    ];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
