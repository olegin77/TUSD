import { Module } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
  makeGaugeProvider,
} from '@willsoto/nestjs-prometheus';
import { ScheduleModule } from '@nestjs/schedule';
import { MetricsService } from './metrics.service';
import { BusinessMetricsService } from './business-metrics.service';

/**
 * MetricsModule provides Prometheus metrics collection and exposition
 * Exposes /metrics endpoint for Prometheus scraping
 */
@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'usdx_',
        },
      },
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [
    MetricsService,
    BusinessMetricsService,
    // HTTP Request metrics
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    }),

    // Business metrics
    makeGaugeProvider({
      name: 'total_value_locked',
      help: 'Total Value Locked (TVL) in USD',
    }),
    makeGaugeProvider({
      name: 'active_wexels_count',
      help: 'Number of active Wexels',
    }),
    makeGaugeProvider({
      name: 'total_users_count',
      help: 'Total number of registered users',
    }),
    makeCounterProvider({
      name: 'deposits_total',
      help: 'Total number of deposits',
      labelNames: ['pool_id', 'chain'],
    }),
    makeCounterProvider({
      name: 'deposits_volume_usd',
      help: 'Total deposit volume in USD',
      labelNames: ['pool_id', 'chain'],
    }),
    makeCounterProvider({
      name: 'marketplace_trades_total',
      help: 'Total number of marketplace trades',
    }),
    makeCounterProvider({
      name: 'marketplace_volume_usd',
      help: 'Total marketplace trading volume in USD',
    }),
    makeGaugeProvider({
      name: 'collateralized_wexels_count',
      help: 'Number of collateralized Wexels',
    }),
    makeGaugeProvider({
      name: 'total_loans_outstanding_usd',
      help: 'Total outstanding loans in USD',
    }),

    // Database metrics
    makeCounterProvider({
      name: 'db_queries_total',
      help: 'Total number of database queries',
      labelNames: ['operation', 'table'],
    }),
    makeHistogramProvider({
      name: 'db_query_duration_seconds',
      help: 'Database query duration in seconds',
      labelNames: ['operation', 'table'],
      buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    }),

    // Blockchain indexer metrics
    makeGaugeProvider({
      name: 'indexer_last_block',
      help: 'Last indexed block number',
      labelNames: ['chain'],
    }),
    makeCounterProvider({
      name: 'indexer_events_processed',
      help: 'Total number of blockchain events processed',
      labelNames: ['chain', 'event_type'],
    }),
    makeHistogramProvider({
      name: 'indexer_lag_seconds',
      help: 'Indexer lag behind chain head in seconds',
      labelNames: ['chain'],
      buckets: [1, 5, 10, 30, 60, 300, 600],
    }),

    // Price oracle metrics
    makeGaugeProvider({
      name: 'oracle_price',
      help: 'Current price from oracle',
      labelNames: ['asset', 'source'],
    }),
    makeCounterProvider({
      name: 'oracle_updates_total',
      help: 'Total number of oracle price updates',
      labelNames: ['asset', 'source'],
    }),
    makeCounterProvider({
      name: 'oracle_errors_total',
      help: 'Total number of oracle errors',
      labelNames: ['asset', 'source'],
    }),
  ],
  exports: [PrometheusModule, MetricsService, BusinessMetricsService],
})
export class MetricsModule {}
