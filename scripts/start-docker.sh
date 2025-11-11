#!/bin/bash
# Скрипт для запуска Docker сервисов (требует sudo)

echo "Adding user to docker group..."
sudo usermod -aG docker $USER

echo "Starting Docker services..."
cd /mnt/ramdisk/TUSD
docker compose -f infra/production/docker-compose.backend.yml up -d

echo "Waiting for services to be ready..."
sleep 10

echo "Checking services status..."
docker compose -f infra/production/docker-compose.backend.yml ps

echo ""
echo "Services started successfully!"
echo "PostgreSQL: localhost:5432"
echo "Redis: localhost:6379"
echo ""
echo "Note: You may need to logout and login again for docker group membership to take effect"
