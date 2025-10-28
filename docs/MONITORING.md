# USDX/Wexel Platform Monitoring

## Overview

The USDX/Wexel platform uses a comprehensive monitoring solution based on Prometheus, Grafana, and Alertmanager to ensure system health, performance, and business metrics visibility.

## Components

### 1. Metrics Collection (Prometheus)

**Technology**: Prometheus + prom-client  
**Endpoint**: `/metrics`  
**Scrape Interval**: 15 seconds

The backend exposes metrics in Prometheus format at the `/metrics` endpoint. All HTTP requests are automatically instrumented using the `MetricsInterceptor`.

### 2. Visualization (Grafana)

**Technology**: Grafana 10.4.0  
**Access**: http://localhost:3002  
**Default Credentials**: admin/admin

Pre-configured dashboards provide real-time visibility into:

- Business KPIs (TVL, users, wexels)
- API performance (latency, error rate)
- Indexer status (lag, events processed)
- Database performance
- Oracle health

### 3. Alerting (Alertmanager)

**Technology**: Prometheus Alertmanager  
**Access**: http://localhost:9093

Configured to send alerts via:

- Webhook to backend API
- Slack (optional)
- Email (optional)
- PagerDuty (optional)

## Metrics Categories

### Business Metrics

Automatically updated every 5 minutes by `BusinessMetricsService`:

- **TVL**: Total Value Locked across all active wexels
- **Users**: Total registered users
- **Wexels**: Active and collateralized wexels count
- **Deposits**: Count and volume by pool and chain
- **Marketplace**: Trading volume and transaction count
- **Loans**: Outstanding loan amount

### Technical Metrics

Automatically recorded by interceptors and services:

- **HTTP**: Request count, duration, error rate by route
- **Database**: Query count, duration by operation and table
- **Indexer**: Block height, lag, events processed
- **Oracle**: Price updates, errors by source

## Implementation

### MetricsService

The `MetricsService` provides convenient methods to record metrics from anywhere in the application:

```typescript
import { MetricsService } from "./common/monitoring/metrics.service";

@Injectable()
export class YourService {
  constructor(private readonly metrics: MetricsService) {}

  async someMethod() {
    // Record a deposit
    this.metrics.recordDeposit(poolId, "solana", amountUsd);

    // Update TVL
    this.metrics.setTotalValueLocked(newTvl);

    // Record oracle price
    this.metrics.setOraclePrice("USDT", "pyth", 1.0);
  }
}
```

### Automatic HTTP Metrics

All HTTP requests are automatically instrumented via `MetricsInterceptor`:

- Request count by method, route, status code
- Request duration histogram
- No additional code required

### Business Metrics Updates

Business metrics are automatically updated every 5 minutes via scheduled task:

```typescript
@Cron(CronExpression.EVERY_5_MINUTES)
async updateBusinessMetrics() {
  // Updates TVL, wexels count, users count, etc.
}
```

## Alert Rules

### Critical Alerts

1. **ServiceDown**: Service unreachable
   - Threshold: > 1 minute
   - Action: Immediate notification

2. **HighErrorRate**: Excessive API errors
   - Threshold: > 5% error rate for 5 minutes
   - Action: Immediate notification

3. **OraclePriceUpdateFailures**: Oracle not updating
   - Threshold: > 0.1 errors/sec for 5 minutes
   - Action: Immediate notification

### Warning Alerts

1. **HighResponseTime**: Slow API responses
   - Threshold: P95 > 3s for 5 minutes
   - Action: Grouped notification

2. **IndexerHighLag**: Indexer falling behind
   - Threshold: > 5 minutes lag for 10 minutes
   - Action: Grouped notification

3. **TVLDropped**: Significant TVL decrease
   - Threshold: > 10% drop in 1 hour
   - Action: Grouped notification

### Info Alerts

1. **LowActiveWexels**: Wexels count decreasing
   - Threshold: > 20% drop in 24 hours
   - Action: Batched notification

2. **NoDepositsDetected**: No user activity
   - Threshold: 0 deposits for 4 hours
   - Action: Batched notification

## Dashboards

### USDX Platform Overview

Main dashboard (`usdx-overview`) includes:

**Row 1: Business KPIs**

- TVL Gauge
- Wexels Count (Active/Collateralized) Timeline
- Total Users Gauge

**Row 2: Deposits & Loans**

- Deposits Rate by Pool (Bar Chart)
- Outstanding Loans Timeline

**Row 3: API Health**

- API Error Rate
- API Response Time (P95/P99)

**Row 4: Indexer & Oracle**

- Solana Indexer Lag Gauge
- Blockchain Events Processed
- Oracle Prices Timeline

### Creating Custom Dashboards

See `infra/monitoring/README.md` for instructions on creating and exporting custom dashboards.

## Usage

### Local Development

1. Start infrastructure:

   ```bash
   cd infra/local
   docker-compose up -d  # PostgreSQL, Redis
   ```

2. Start monitoring stack:

   ```bash
   cd infra/monitoring
   docker-compose up -d  # Prometheus, Grafana, Alertmanager
   ```

3. Start backend:

   ```bash
   cd apps/indexer
   pnpm start:dev
   ```

4. Access:
   - Metrics: http://localhost:3001/metrics
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3002
   - Alertmanager: http://localhost:9093

### Production

1. Deploy monitoring stack to production environment
2. Configure authentication for `/metrics` endpoint
3. Set up alert channels (Slack, Email, PagerDuty)
4. Enable HTTPS for all monitoring services
5. Configure backup and retention policies

## Best Practices

### Metrics

1. **Use appropriate metric types**:
   - Counter: Monotonically increasing values (requests, errors)
   - Gauge: Values that can go up or down (TVL, users, memory)
   - Histogram: Distribution of values (latency, query time)

2. **Add relevant labels**:
   - Use labels for dimensions (pool_id, chain, route)
   - Keep label cardinality low (< 100 unique values per label)

3. **Record metrics close to the source**:
   - Add metrics when handling business logic
   - Use interceptors for cross-cutting concerns

### Alerts

1. **Set appropriate thresholds**:
   - Based on historical data and SLOs
   - Avoid alert fatigue (too many false positives)

2. **Include actionable information**:
   - Clear description of the problem
   - Runbook link or remediation steps

3. **Route alerts by severity**:
   - Critical: Immediate action required
   - Warning: Action needed soon
   - Info: For awareness only

### Dashboards

1. **Organize by audience**:
   - Business: TVL, users, revenue
   - Engineering: API, database, errors
   - Operations: Infrastructure, alerts

2. **Use templates for consistency**:
   - Standardize colors, units, time ranges
   - Create dashboard templates for common patterns

3. **Keep dashboards focused**:
   - One dashboard per topic/service
   - Link related dashboards

## Monitoring Checklist

- [ ] Prometheus scraping backend successfully
- [ ] Grafana datasource configured correctly
- [ ] Business metrics updating every 5 minutes
- [ ] HTTP metrics recording for all endpoints
- [ ] Alert rules tested and firing correctly
- [ ] Alert channels configured (Slack/Email/PagerDuty)
- [ ] Dashboards accessible and loading data
- [ ] Data retention policy configured
- [ ] Backup procedures in place
- [ ] Access control and authentication configured
- [ ] Documentation up to date

## References

- Infrastructure Setup: `/infra/monitoring/README.md`
- Metrics Implementation: `/apps/indexer/src/common/monitoring/`
- Alert Configuration: `/infra/monitoring/prometheus/alerts.yml`
- Dashboards: `/infra/monitoring/grafana/dashboards/`

## Support

For monitoring issues:

1. Check service logs: `docker logs <service_name>`
2. Verify connectivity: `curl http://localhost:<port>`
3. Review configuration files in `/infra/monitoring/`
4. Consult component documentation (Prometheus, Grafana, Alertmanager)
