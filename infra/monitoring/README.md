# USDX/Wexel Monitoring Infrastructure

This directory contains the complete monitoring stack for the USDX/Wexel platform using Prometheus, Grafana, and Alertmanager.

## Overview

The monitoring system consists of:

- **Prometheus**: Time-series database for metrics collection
- **Grafana**: Visualization and dashboards
- **Alertmanager**: Alert routing and notification management

## Architecture

```
┌─────────────────┐
│  USDX Backend   │──────┐
│  /metrics       │      │
└─────────────────┘      │
                         │ scrape metrics
┌─────────────────┐      │
│   Prometheus    │◄─────┘
│   :9090         │
└────────┬────────┘
         │
         │ query metrics
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│    Grafana      │      │  Alertmanager    │
│    :3002        │◄─────┤     :9093        │
└─────────────────┘      └──────────────────┘
         │                         │
         │                         │
         ▼                         ▼
    Dashboards              Notifications
                        (Email/Slack/Webhook)
```

## Quick Start

### 1. Start Monitoring Stack

```bash
cd infra/monitoring
docker-compose up -d
```

This will start:

- Prometheus on http://localhost:9090
- Grafana on http://localhost:3002 (admin/admin)
- Alertmanager on http://localhost:9093

### 2. Start Backend with Metrics

Ensure your backend is running and exposing metrics:

```bash
cd apps/indexer
pnpm start:dev
```

Metrics will be available at http://localhost:3001/metrics

### 3. Access Dashboards

1. Open Grafana: http://localhost:3002
2. Login with default credentials: admin/admin
3. Navigate to Dashboards → USDX/Wexel Platform Overview

## Metrics Collected

### Business Metrics

| Metric                             | Type    | Description                               |
| ---------------------------------- | ------- | ----------------------------------------- |
| `usdx_total_value_locked`          | Gauge   | Total Value Locked (TVL) in USD           |
| `usdx_active_wexels_count`         | Gauge   | Number of active Wexels                   |
| `usdx_total_users_count`           | Gauge   | Total number of registered users          |
| `usdx_deposits_total`              | Counter | Total number of deposits (by pool, chain) |
| `usdx_deposits_volume_usd`         | Counter | Total deposit volume in USD               |
| `usdx_marketplace_trades_total`    | Counter | Total marketplace trades                  |
| `usdx_marketplace_volume_usd`      | Counter | Marketplace trading volume                |
| `usdx_collateralized_wexels_count` | Gauge   | Number of collateralized Wexels           |
| `usdx_total_loans_outstanding_usd` | Gauge   | Total outstanding loans                   |

### API Metrics

| Metric                               | Type      | Description                                    |
| ------------------------------------ | --------- | ---------------------------------------------- |
| `usdx_http_requests_total`           | Counter   | Total HTTP requests (by method, route, status) |
| `usdx_http_request_duration_seconds` | Histogram | HTTP request duration                          |

### Database Metrics

| Metric                           | Type      | Description                                  |
| -------------------------------- | --------- | -------------------------------------------- |
| `usdx_db_queries_total`          | Counter   | Total database queries (by operation, table) |
| `usdx_db_query_duration_seconds` | Histogram | Database query duration                      |

### Indexer Metrics

| Metric                          | Type      | Description                                  |
| ------------------------------- | --------- | -------------------------------------------- |
| `usdx_indexer_last_block`       | Gauge     | Last indexed block number (by chain)         |
| `usdx_indexer_events_processed` | Counter   | Blockchain events processed (by chain, type) |
| `usdx_indexer_lag_seconds`      | Histogram | Indexer lag behind chain head                |

### Oracle Metrics

| Metric                      | Type    | Description                                  |
| --------------------------- | ------- | -------------------------------------------- |
| `usdx_oracle_price`         | Gauge   | Current price from oracle (by asset, source) |
| `usdx_oracle_updates_total` | Counter | Oracle price updates                         |
| `usdx_oracle_errors_total`  | Counter | Oracle errors                                |

## Alerts

The following alerts are configured in `prometheus/alerts.yml`:

### Critical Alerts

- **ServiceDown**: Service is unreachable for > 1 minute
- **HighErrorRate**: API error rate > 5% for 5 minutes
- **OraclePriceUpdateFailures**: Oracle price updates failing

### Warning Alerts

- **HighResponseTime**: P95 response time > 3s for 5 minutes
- **IndexerHighLag**: Indexer lag > 5 minutes behind chain head
- **TVLDropped**: TVL decreased by > 10% in 1 hour
- **SlowDatabaseQueries**: P95 query time > 1s
- **NoDepositsDetected**: No deposits for 4 hours

### Info Alerts

- **LowActiveWexels**: Active wexels decreased by > 20% in 24 hours

## Alert Routing

Alerts are routed through Alertmanager to different channels based on severity:

- **Critical**: Immediate notification (PagerDuty, Email, Slack)
- **Warning**: Grouped notification every 5 minutes (Slack, Email)
- **Info**: Batched notification every 1 hour (Slack)

### Configuring Alert Channels

Edit `alertmanager/alertmanager.yml` to configure notification channels:

#### Slack

```yaml
slack_configs:
  - api_url: "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
    channel: "#alerts"
    title: "{{ .GroupLabels.alertname }}"
    text: "{{ range .Alerts }}{{ .Annotations.description }}{{ end }}"
```

#### Email

```yaml
email_configs:
  - to: "oncall@usdx-wexel.com"
    headers:
      Subject: "[ALERT] {{ .GroupLabels.alertname }}"
```

#### PagerDuty

```yaml
pagerduty_configs:
  - service_key: "your_pagerduty_service_key"
```

## Grafana Dashboards

### USDX Platform Overview

Located at: `grafana/dashboards/usdx-overview.json`

Includes panels for:

- TVL gauge
- Active/Collateralized Wexels count
- Total users
- Deposits rate by pool
- Outstanding loans
- API error rate
- API response time (P95/P99)
- Indexer lag
- Blockchain events processed
- Oracle prices

### Creating Custom Dashboards

1. Access Grafana at http://localhost:3002
2. Click "+" → "Dashboard"
3. Add panels with PromQL queries
4. Export JSON and save to `grafana/dashboards/`

## Production Deployment

### Environment Variables

Set the following in your backend `.env`:

```bash
# Metrics are automatically exposed on /metrics
# No additional configuration needed
```

### Prometheus Configuration

Update `prometheus/prometheus.yml` with production targets:

```yaml
scrape_configs:
  - job_name: "usdx-indexer"
    static_configs:
      - targets: ["production-backend.example.com:3001"]
    # Add authentication if needed
    basic_auth:
      username: "metrics"
      password: "secure_password"
```

### Security Considerations

1. **Protect /metrics endpoint**: Add authentication middleware in production
2. **Use HTTPS**: Configure TLS for Prometheus/Grafana
3. **Network isolation**: Run monitoring stack in a separate network
4. **Access control**: Restrict Grafana access with RBAC

### Scaling

For high-traffic deployments:

1. **Prometheus**: Use federation or Thanos for long-term storage
2. **Grafana**: Deploy multiple instances behind a load balancer
3. **Alertmanager**: Configure clustering for high availability

## Maintenance

### Data Retention

Prometheus default retention: 30 days  
To change: Edit `prometheus.yml` → `--storage.tsdb.retention.time=90d`

### Backup

```bash
# Backup Prometheus data
docker cp usdx-prometheus:/prometheus ./backup/prometheus-$(date +%Y%m%d)

# Backup Grafana dashboards
docker cp usdx-grafana:/var/lib/grafana ./backup/grafana-$(date +%Y%m%d)
```

### Updating

```bash
cd infra/monitoring
docker-compose pull
docker-compose up -d
```

## Troubleshooting

### Metrics not appearing

1. Check backend is running: `curl http://localhost:3001/metrics`
2. Check Prometheus targets: http://localhost:9090/targets
3. Verify network connectivity between containers

### Alerts not firing

1. Check alert rules: http://localhost:9090/alerts
2. Verify Alertmanager config: http://localhost:9093/#/status
3. Check logs: `docker logs usdx-alertmanager`

### Dashboard not loading

1. Check Grafana logs: `docker logs usdx-grafana`
2. Verify Prometheus datasource: Grafana → Configuration → Data Sources
3. Test query in Explore view

## References

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [PromQL Basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)
