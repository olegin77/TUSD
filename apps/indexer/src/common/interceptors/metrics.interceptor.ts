import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from '../monitoring/metrics.service';

/**
 * MetricsInterceptor automatically records HTTP request metrics
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MetricsInterceptor.name);

  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.recordMetrics(request, response, startTime);
        },
        error: () => {
          this.recordMetrics(request, response, startTime);
        },
      }),
    );
  }

  private recordMetrics(request: any, response: any, startTime: number): void {
    try {
      const duration = (Date.now() - startTime) / 1000; // Convert to seconds
      const method = request.method;
      const route = request.route?.path || request.url;
      const statusCode = response.statusCode;

      this.metricsService.recordHttpRequest(
        method,
        route,
        statusCode,
        duration,
      );
    } catch (error) {
      this.logger.error('Failed to record metrics', error);
    }
  }
}
