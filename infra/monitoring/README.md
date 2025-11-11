# USDX Wexel Monitoring Stack

Prometheus + Grafana monitoring for the USDX Wexel platform.

## Architecture

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Node Exporter**: System-level metrics
- **NestJS Metrics**: Application-level metrics via /metrics endpoint

## Quick Start

```bash
# Start monitoring stack
cd infra/monitoring
docker-compose -f docker-compose.monitoring.yml up -d

# Check status
docker-compose -f docker-compose.monitoring.yml ps

# View logs
docker-compose -f docker-compose.monitoring.yml logs -f
```

## Access URLs

- **Grafana**: http://localhost:3002
  - Username: `admin`
  - Password: `admin123` (configure via GRAFANA_PASSWORD env var)
  
- **Prometheus**: http://localhost:9090

- **Node Exporter**: http://localhost:9100/metrics

- **Indexer Metrics**: http://localhost:3001/metrics

## Metrics Collected

### Application Metrics
- HTTP request rate and duration
- Response status codes
- Database query performance
- Active connections

### Business Metrics
- Total Value Locked (TVL)
- Active Wexels count
- Deposit volume
- Marketplace trading volume
- User count

### Blockchain Metrics
- Indexer last block
- Events processed
- Indexer lag
- Oracle prices
- Oracle update frequency

### System Metrics
- CPU usage
- Memory usage
- Disk I/O
- Network traffic

## Dashboards

Pre-configured dashboard: **USDX Wexel Platform**

Includes:
- HTTP request rate
- Response time (p95)
- CPU and memory usage
- Database connections
- Active deposits
- Total TVL
- Error rates

## Configuration

### Prometheus
Edit `prometheus/prometheus.yml` to add/modify scrape targets.

### Grafana
- Datasource: Auto-provisioned from `grafana/provisioning/datasources/`
- Dashboards: Auto-loaded from `grafana/dashboards/`

## Alerts (Optional)

Create alert rules in `prometheus/alerts/` directory:

```yaml
groups:
  - name: usdx_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High 5xx error rate"
```

## Retention

- Prometheus: 30 days
- Grafana: Persistent volumes

## Production Considerations

1. **Security**:
   - Change default Grafana password
   - Enable authentication on Prometheus
   - Use TLS/SSL
   - Restrict network access

2. **Scaling**:
   - Consider Prometheus federation for multiple instances
   - Use remote storage for long-term retention
   - Implement Alertmanager for notifications

3. **Backup**:
   - Regular backups of Grafana dashboards
   - Prometheus data snapshots

## Troubleshooting

### Metrics not showing
```bash
# Check if metrics endpoint is accessible
curl http://localhost:3001/metrics

# Check Prometheus targets
# Visit: http://localhost:9090/targets
```

### Dashboard issues
```bash
# Restart Grafana
docker-compose -f docker-compose.monitoring.yml restart grafana

# Check Grafana logs
docker-compose -f docker-compose.monitoring.yml logs grafana
```

## Stop Monitoring

```bash
docker-compose -f docker-compose.monitoring.yml down

# Remove volumes (data loss!)
docker-compose -f docker-compose.monitoring.yml down -v
```
