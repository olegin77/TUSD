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
import { ErrorResponse } from '../types/api.types';

export interface ApiErrorResponse extends ErrorResponse {}

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
      requestId: (request.headers['x-request-id'] as string) || undefined,
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
        return (
          ((response as Record<string, unknown>).message as string) ||
          exception.message
        );
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

  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...(body as Record<string, unknown>) };
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
