import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram, Gauge } from 'prom-client';

/**
 * MetricsService provides convenient methods to record metrics
 */
@Injectable()
export class MetricsService {
  constructor(
    // HTTP metrics
    @InjectMetric('http_requests_total')
    private httpRequestsCounter: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private httpDurationHistogram: Histogram<string>,

    // Business metrics
    @InjectMetric('total_value_locked')
    private tvlGauge: Gauge<string>,
    @InjectMetric('active_wexels_count')
    private activeWexelsGauge: Gauge<string>,
    @InjectMetric('total_users_count')
    private totalUsersGauge: Gauge<string>,
    @InjectMetric('deposits_total')
    private depositsCounter: Counter<string>,
    @InjectMetric('deposits_volume_usd')
    private depositsVolumeCounter: Counter<string>,
    @InjectMetric('marketplace_trades_total')
    private tradesCounter: Counter<string>,
    @InjectMetric('marketplace_volume_usd')
    private tradeVolumeCounter: Counter<string>,
    @InjectMetric('collateralized_wexels_count')
    private collateralizedWexelsGauge: Gauge<string>,
    @InjectMetric('total_loans_outstanding_usd')
    private loansOutstandingGauge: Gauge<string>,

    // Database metrics
    @InjectMetric('db_queries_total')
    private dbQueriesCounter: Counter<string>,
    @InjectMetric('db_query_duration_seconds')
    private dbDurationHistogram: Histogram<string>,

    // Indexer metrics
    @InjectMetric('indexer_last_block')
    private indexerLastBlockGauge: Gauge<string>,
    @InjectMetric('indexer_events_processed')
    private eventsProcessedCounter: Counter<string>,
    @InjectMetric('indexer_lag_seconds')
    private indexerLagHistogram: Histogram<string>,

    // Oracle metrics
    @InjectMetric('oracle_price')
    private oraclePriceGauge: Gauge<string>,
    @InjectMetric('oracle_updates_total')
    private oracleUpdatesCounter: Counter<string>,
    @InjectMetric('oracle_errors_total')
    private oracleErrorsCounter: Counter<string>,
  ) {}

  // HTTP metrics
  recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    duration: number,
  ): void {
    this.httpRequestsCounter.inc({ method, route, status_code: statusCode });
    this.httpDurationHistogram.observe(
      { method, route, status_code: statusCode },
      duration,
    );
  }

  // Business metrics
  setTotalValueLocked(tvl: number): void {
    this.tvlGauge.set(tvl);
  }

  setActiveWexelsCount(count: number): void {
    this.activeWexelsGauge.set(count);
  }

  setTotalUsersCount(count: number): void {
    this.totalUsersGauge.set(count);
  }

  recordDeposit(poolId: number, chain: string, amountUsd: number): void {
    this.depositsCounter.inc({ pool_id: poolId, chain });
    this.depositsVolumeCounter.inc({ pool_id: poolId, chain }, amountUsd);
  }

  recordMarketplaceTrade(volumeUsd: number): void {
    this.tradesCounter.inc();
    this.tradeVolumeCounter.inc(volumeUsd);
  }

  setCollateralizedWexelsCount(count: number): void {
    this.collateralizedWexelsGauge.set(count);
  }

  setTotalLoansOutstanding(totalUsd: number): void {
    this.loansOutstandingGauge.set(totalUsd);
  }

  // Database metrics
  recordDbQuery(operation: string, table: string, duration: number): void {
    this.dbQueriesCounter.inc({ operation, table });
    this.dbDurationHistogram.observe({ operation, table }, duration);
  }

  // Indexer metrics
  setIndexerLastBlock(chain: string, blockNumber: number): void {
    this.indexerLastBlockGauge.set({ chain }, blockNumber);
  }

  recordEventProcessed(chain: string, eventType: string): void {
    this.eventsProcessedCounter.inc({ chain, event_type: eventType });
  }

  recordIndexerLag(chain: string, lagSeconds: number): void {
    this.indexerLagHistogram.observe({ chain }, lagSeconds);
  }

  // Oracle metrics
  setOraclePrice(asset: string, source: string, price: number): void {
    this.oraclePriceGauge.set({ asset, source }, price);
  }

  recordOracleUpdate(asset: string, source: string): void {
    this.oracleUpdatesCounter.inc({ asset, source });
  }

  recordOracleError(asset: string, source: string): void {
    this.oracleErrorsCounter.inc({ asset, source });
  }
}
