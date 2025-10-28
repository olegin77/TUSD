# USDX/Wexel Monitoring System - Deployment Guide

## Quick Start (5 minutes)

### 1. Start Local Infrastructure

```bash
# Terminal 1: Start PostgreSQL and Redis
cd infra/local
docker-compose up -d

# Verify services are running
docker ps | grep -E "postgres|redis"
```

### 2. Start Monitoring Stack

```bash
# Terminal 2: Start Prometheus, Grafana, and Alertmanager
cd infra/monitoring
docker-compose up -d

# Verify monitoring services
docker ps | grep -E "prometheus|grafana|alertmanager"
```

### 3. Start Backend with Metrics

```bash
# Terminal 3: Start the backend/indexer
cd apps/indexer

# Install dependencies (if not done)
pnpm install

# Start in development mode
pnpm start:dev
```

### 4. Access Monitoring Dashboard

Open your browser and navigate to:

- **Grafana**: http://localhost:3002
  - Username: `admin`
  - Password: `admin` (change on first login)
- **Prometheus**: http://localhost:9090
- **Alertmanager**: http://localhost:9093
- **Metrics Endpoint**: http://localhost:3001/metrics

### 5. View the Dashboard

1. In Grafana, navigate to **Dashboards** → **USDX**
2. Click on **USDX/Wexel Platform Overview**
3. You should see:
   - TVL Gauge (will be 0 initially)
   - Active Wexels Count
   - Total Users
   - API metrics (if you make API calls)
   - And more...

## Testing the Monitoring System

### Generate Test Metrics

```bash
# Test the health endpoint (generates HTTP metrics)
curl http://localhost:3001/health

# Test the metrics endpoint
curl http://localhost:3001/metrics

# Make multiple requests to see metrics in action
for i in {1..10}; do curl http://localhost:3001/health; done
```

### Check Metrics in Prometheus

1. Open http://localhost:9090
2. Try these queries:

   ```promql
   # Total HTTP requests
   usdx_http_requests_total

   # HTTP request rate (per second)
   rate(usdx_http_requests_total[1m])

   # HTTP request duration (95th percentile)
   histogram_quantile(0.95, rate(usdx_http_request_duration_seconds_bucket[5m]))

   # Total Value Locked
   usdx_total_value_locked

   # Active Wexels
   usdx_active_wexels_count
   ```

### View Alerts

1. Open http://localhost:9090/alerts
2. You should see all configured alert rules
3. Initially, most will be "Inactive" (no data yet)
4. Generate load to trigger alerts (e.g., make 500 errors)

## Production Deployment

### Prerequisites

- Docker and Docker Compose installed
- Backend deployed and accessible
- Domain names for Grafana/Prometheus (optional)
- SSL certificates (recommended)
- SMTP server for email alerts (optional)
- Slack/PagerDuty accounts (optional)

### Step 1: Update Prometheus Configuration

Edit `infra/monitoring/prometheus/prometheus.yml`:

```yaml
scrape_configs:
  - job_name: "usdx-indexer"
    metrics_path: "/metrics"
    static_configs:
      - targets: ["your-backend.example.com:3001"]
    # Add authentication
    basic_auth:
      username: "metrics_user"
      password: "secure_password"
    # OR use bearer token
    # bearer_token: 'your_secret_token'
```

### Step 2: Secure the /metrics Endpoint

Add authentication middleware in your backend:

```typescript
// apps/indexer/src/main.ts
import { NestFactory } from "@nestjs/core";
import * as basicAuth from "express-basic-auth";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Protect /metrics endpoint
  app.use(
    "/metrics",
    basicAuth({
      users: { metrics_user: "secure_password" },
      challenge: true,
    })
  );

  await app.listen(3001);
}
```

### Step 3: Configure Alert Notifications

Edit `infra/monitoring/alertmanager/alertmanager.yml`:

#### Slack Notifications

```yaml
receivers:
  - name: "critical-alerts"
    slack_configs:
      - api_url: "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
        channel: "#critical-alerts"
        title: "[CRITICAL] {{ .GroupLabels.alertname }}"
        text: "{{ range .Alerts }}{{ .Annotations.description }}{{ end }}"
        send_resolved: true
```

#### Email Notifications

```yaml
global:
  smtp_smarthost: "smtp.gmail.com:587"
  smtp_from: "alerts@usdx-wexel.com"
  smtp_auth_username: "your-email@gmail.com"
  smtp_auth_password: "your-app-password"

receivers:
  - name: "critical-alerts"
    email_configs:
      - to: "oncall@usdx-wexel.com"
        headers:
          Subject: "[CRITICAL] {{ .GroupLabels.alertname }}"
```

#### PagerDuty Notifications

```yaml
receivers:
  - name: "critical-alerts"
    pagerduty_configs:
      - service_key: "your_pagerduty_integration_key"
        description: "{{ .GroupLabels.alertname }}: {{ .Annotations.summary }}"
```

### Step 4: Deploy with Docker Compose

```bash
cd infra/monitoring

# Pull latest images
docker-compose pull

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Verify all services are healthy
docker-compose ps
```

### Step 5: Configure Grafana for Production

1. **Change Admin Password**:

   ```bash
   docker exec -it usdx-grafana grafana-cli admin reset-admin-password NEW_PASSWORD
   ```

2. **Set up HTTPS** (using reverse proxy like Nginx):

   ```nginx
   server {
       listen 443 ssl http2;
       server_name grafana.example.com;

       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       location / {
           proxy_pass http://localhost:3002;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **Configure Authentication** (OAuth, LDAP, etc.):
   Edit `infra/monitoring/docker-compose.yml` → Grafana environment:
   ```yaml
   environment:
     - GF_AUTH_GOOGLE_ENABLED=true
     - GF_AUTH_GOOGLE_CLIENT_ID=your_client_id
     - GF_AUTH_GOOGLE_CLIENT_SECRET=your_client_secret
     - GF_AUTH_GOOGLE_ALLOWED_DOMAINS=example.com
   ```

### Step 6: Set up Data Retention

Edit `infra/monitoring/docker-compose.yml`:

```yaml
services:
  prometheus:
    command:
      - "--storage.tsdb.retention.time=90d" # Keep data for 90 days
      - "--storage.tsdb.retention.size=50GB" # Or limit by size
```

### Step 7: Configure Backups

```bash
# Create backup script
cat > /etc/cron.daily/backup-monitoring <<'EOF'
#!/bin/bash
BACKUP_DIR="/backup/monitoring"
DATE=$(date +%Y%m%d)

# Backup Prometheus data
docker exec usdx-prometheus tar czf - /prometheus > "$BACKUP_DIR/prometheus-$DATE.tar.gz"

# Backup Grafana data
docker exec usdx-grafana tar czf - /var/lib/grafana > "$BACKUP_DIR/grafana-$DATE.tar.gz"

# Keep only last 30 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete
EOF

chmod +x /etc/cron.daily/backup-monitoring
```

## Troubleshooting

### Problem: Metrics endpoint returns 404

**Solution**:

```bash
# Check if backend is running
curl http://localhost:3001/health

# Check if MetricsModule is imported in AppModule
# Check logs for any errors
cd apps/indexer && pnpm start:dev
```

### Problem: Prometheus not scraping

**Solution**:

1. Check Prometheus targets: http://localhost:9090/targets
2. Verify backend URL in `prometheus/prometheus.yml`
3. Check network connectivity:
   ```bash
   docker exec usdx-prometheus wget -O- http://host.docker.internal:3001/metrics
   ```

### Problem: Grafana dashboard shows "No Data"

**Solution**:

1. Verify Prometheus datasource: Grafana → Configuration → Data Sources
2. Test query in Explore view
3. Check if metrics are present in Prometheus: http://localhost:9090/graph
4. Wait 5 minutes for business metrics to be updated (scheduled task)

### Problem: Alerts not firing

**Solution**:

1. Check alert rules: http://localhost:9090/alerts
2. Verify Alertmanager is running: http://localhost:9093
3. Check Prometheus logs:
   ```bash
   docker logs usdx-prometheus
   ```
4. Verify alert conditions are met (generate test data)

### Problem: Business metrics not updating

**Solution**:

1. Check backend logs for cron job execution:
   ```bash
   cd apps/indexer && pnpm start:dev
   # Look for: "Updating business metrics..."
   ```
2. Verify database connection
3. Check BusinessMetricsService is properly injected

## Monitoring Best Practices

### 1. Set Meaningful Alert Thresholds

- Base thresholds on historical data (P95, P99)
- Start conservative, tune based on false positives
- Review and adjust monthly

### 2. Use Alert Grouping

- Group related alerts to reduce noise
- Use inhibit rules to prevent alert storms
- Set appropriate `group_wait` and `group_interval`

### 3. Create Runbooks

For each alert, document:

- What it means
- How to investigate
- How to resolve
- Who to escalate to

Example:

```markdown
## Alert: HighErrorRate

**Description**: API error rate exceeded 5% for 5 minutes

**Investigation**:

1. Check error logs: `docker logs usdx-indexer | grep ERROR`
2. Check recent deployments
3. Check database connectivity
4. Check external service status (Solana RPC, Oracles)

**Resolution**:

- If deployment issue: Rollback to previous version
- If database issue: Check connection pool, restart if needed
- If external service: Wait for recovery or switch to backup

**Escalation**: Page on-call engineer if not resolved in 15 minutes
```

### 4. Monitor the Monitors

- Set up external health checks for Grafana/Prometheus
- Monitor disk space on monitoring servers
- Set up alerts for monitoring system itself

### 5. Regular Maintenance

- **Weekly**: Review new alerts, tune thresholds
- **Monthly**: Archive old dashboards, update documentation
- **Quarterly**: Review metrics coverage, add new metrics as needed
- **Yearly**: Evaluate if monitoring stack still meets needs

## Cost Optimization

### Storage

- Adjust retention period based on needs (default: 30 days)
- Use Thanos or Cortex for long-term storage
- Compress old data

### Resource Usage

- Monitor Prometheus memory usage (can grow with high cardinality)
- Limit number of unique label values
- Use recording rules for expensive queries

### Alerting

- Consolidate similar alerts
- Use alert severity to reduce noise
- Implement on-call rotation to distribute load

## Security Checklist

- [ ] Authentication enabled on Grafana
- [ ] `/metrics` endpoint protected (basic auth or IP whitelist)
- [ ] HTTPS enabled for all monitoring services
- [ ] Firewall rules restricting access to monitoring ports
- [ ] Regular security updates for Docker images
- [ ] Audit logs enabled
- [ ] Secrets stored securely (not in git)
- [ ] Network segmentation (monitoring in separate network)

## Support

For issues or questions:

1. Check documentation:
   - `/docs/MONITORING.md` - Technical documentation
   - `/infra/monitoring/README.md` - Infrastructure guide

2. Review logs:

   ```bash
   docker logs usdx-prometheus
   docker logs usdx-grafana
   docker logs usdx-alertmanager
   docker logs usdx-indexer
   ```

3. Search common issues in this guide

4. Contact DevOps team if unresolved

## Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [PromQL Tutorial](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Dashboard Best Practices](https://grafana.com/docs/grafana/latest/best-practices/)

---

**Last Updated**: 2025-10-28  
**Version**: 1.0  
**Maintainer**: DevOps Team
