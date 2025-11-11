#!/bin/bash

set -e

echo "🔍 Starting USDX Wexel Monitoring Stack..."

cd "$(dirname "$0")/../infra/monitoring"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create directories if they don't exist
mkdir -p prometheus grafana/dashboards grafana/provisioning/{datasources,dashboards}

# Start monitoring services
echo "📊 Starting Prometheus, Grafana, and Node Exporter..."
docker-compose -f docker-compose.monitoring.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 5

# Check service status
echo ""
echo "✅ Monitoring stack started!"
echo ""
echo "📈 Access URLs:"
echo "  Grafana:    http://localhost:3002 (admin/admin123)"
echo "  Prometheus: http://localhost:9090"
echo "  Metrics:    http://localhost:3001/metrics"
echo ""
echo "📊 Pre-configured dashboard: USDX Wexel Platform"
echo ""

# Check if services are running
docker-compose -f docker-compose.monitoring.yml ps

echo ""
echo "💡 To view logs: docker-compose -f infra/monitoring/docker-compose.monitoring.yml logs -f"
echo "💡 To stop: docker-compose -f infra/monitoring/docker-compose.monitoring.yml down"
