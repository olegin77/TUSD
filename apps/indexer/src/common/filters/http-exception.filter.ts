import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Sentry } from '../sentry/sentry.config';

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  requestId?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getStatus(exception);
    const message = this.getMessage(exception);
    const error = this.getError(exception);

    const errorResponse: ApiErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.headers['x-request-id'] as string,
    };

    // Log error
    this.logError(exception, request, errorResponse);

    // Send error to Sentry for non-validation errors
    if (status >= 500) {
      Sentry.captureException(exception, {
        tags: {
          path: request.url,
          method: request.method,
          status,
        },
        extra: {
          request: {
            method: request.method,
            url: request.url,
            headers: request.headers,
            body: this.sanitizeBody(request.body),
          },
          response: errorResponse,
        },
      });
    }

    response.status(status).json(errorResponse);
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown): string | string[] {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (typeof response === 'object' && response !== null) {
        return (response as any).message || exception.message;
      }
    }
    return 'Internal server error';
  }

  private getError(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.name;
    }
    return 'InternalServerError';
  }

  private logError(
    exception: unknown,
    request: Request,
    errorResponse: ApiErrorResponse,
  ): void {
    const { method, url, ip } = request;
    const { statusCode, message } = errorResponse;

    if (statusCode >= 500) {
      this.logger.error(
        `${method} ${url} ${statusCode} - ${ip} - ${JSON.stringify(message)}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `${method} ${url} ${statusCode} - ${ip} - ${JSON.stringify(message)}`,
      );
    }
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
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
