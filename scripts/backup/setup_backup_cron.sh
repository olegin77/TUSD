#!/bin/bash
# Setup automated backup cron jobs for USDX/Wexel Platform

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

log_info "Setting up backup automation..."
log_info "Script directory: $SCRIPT_DIR"
log_info "Project root: $PROJECT_ROOT"

# Make scripts executable
chmod +x "$SCRIPT_DIR/backup_db.sh"
chmod +x "$SCRIPT_DIR/restore_db_test.sh"
log_info "Scripts made executable"

# Create backup configuration file
BACKUP_CONFIG="$SCRIPT_DIR/backup.conf"
if [ ! -f "$BACKUP_CONFIG" ]; then
    cat > "$BACKUP_CONFIG" <<'EOF'
# USDX/Wexel Backup Configuration

# Backup directory (ensure this has enough space)
BACKUP_DIR=/var/backups/usdx-wexel

# Retention policy (days)
RETENTION_DAYS=30

# Database configuration
# These should match your production settings
DB_HOST=localhost
DB_PORT=5432
POSTGRES_DB=usdx_wexel
POSTGRES_USER=usdx
POSTGRES_PASSWORD=usdxpassword

# Redis configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Notification settings
NOTIFICATION_ENABLED=false
NOTIFICATION_URL=

# Environment (production, staging, development)
ENVIRONMENT=production
EOF
    log_info "Created backup configuration: $BACKUP_CONFIG"
    log_warn "Please edit $BACKUP_CONFIG with your production settings"
else
    log_info "Backup configuration already exists: $BACKUP_CONFIG"
fi

# Create cron wrapper script
CRON_WRAPPER="$SCRIPT_DIR/backup_cron.sh"
cat > "$CRON_WRAPPER" <<EOF
#!/bin/bash
# Cron wrapper for backup script with environment loading

set -euo pipefail

# Load configuration
if [ -f "$BACKUP_CONFIG" ]; then
    source "$BACKUP_CONFIG"
fi

# Load environment from .env if exists
if [ -f "$PROJECT_ROOT/.env" ]; then
    set -a
    source "$PROJECT_ROOT/.env"
    set +a
fi

# Run backup script
"$SCRIPT_DIR/backup_db.sh" >> "$SCRIPT_DIR/../logs/backup_\$(date +%Y%m).log" 2>&1

# Exit with backup script exit code
exit \$?
EOF

chmod +x "$CRON_WRAPPER"
log_info "Created cron wrapper: $CRON_WRAPPER"

# Create logs directory
mkdir -p "$SCRIPT_DIR/../logs"
log_info "Created logs directory"

# Suggest cron schedule
log_info ""
log_info "=== Suggested Cron Schedules ==="
echo ""
echo "1. Daily backup at 2:00 AM:"
echo "   0 2 * * * $CRON_WRAPPER"
echo ""
echo "2. Daily backup at 2:00 AM with restore test on Sundays at 3:00 AM:"
echo "   0 2 * * * $CRON_WRAPPER"
echo "   0 3 * * 0 $SCRIPT_DIR/restore_db_test.sh >> $SCRIPT_DIR/../logs/restore_test.log 2>&1"
echo ""
echo "3. Twice daily (2:00 AM and 2:00 PM):"
echo "   0 2,14 * * * $CRON_WRAPPER"
echo ""
echo "To add to crontab, run:"
echo "   crontab -e"
echo ""
echo "Or install system-wide:"
echo "   sudo ln -sf $CRON_WRAPPER /etc/cron.daily/usdx-backup"
echo ""

# Create systemd timer (alternative to cron)
SYSTEMD_SERVICE="/tmp/usdx-backup.service"
SYSTEMD_TIMER="/tmp/usdx-backup.timer"

cat > "$SYSTEMD_SERVICE" <<EOF
[Unit]
Description=USDX/Wexel Database Backup
After=network.target postgresql.service redis.service

[Service]
Type=oneshot
User=$(whoami)
Group=$(whoami)
ExecStart=$CRON_WRAPPER
StandardOutput=journal
StandardError=journal
SyslogIdentifier=usdx-backup

[Install]
WantedBy=multi-user.target
EOF

cat > "$SYSTEMD_TIMER" <<EOF
[Unit]
Description=USDX/Wexel Database Backup Timer
Requires=usdx-backup.service

[Timer]
OnCalendar=daily
OnCalendar=02:00
Persistent=true

[Install]
WantedBy=timers.target
EOF

log_info ""
log_info "=== Systemd Timer (Alternative) ==="
echo ""
echo "Systemd service and timer files created in /tmp"
echo ""
echo "To install:"
echo "  sudo cp $SYSTEMD_SERVICE /etc/systemd/system/"
echo "  sudo cp $SYSTEMD_TIMER /etc/systemd/system/"
echo "  sudo systemctl daemon-reload"
echo "  sudo systemctl enable usdx-backup.timer"
echo "  sudo systemctl start usdx-backup.timer"
echo ""
echo "To check status:"
echo "  sudo systemctl status usdx-backup.timer"
echo "  sudo systemctl list-timers usdx-backup.timer"
echo ""

log_info "=== Setup Complete ==="
log_info "Next steps:"
echo "  1. Edit $BACKUP_CONFIG with production settings"
echo "  2. Test backup manually: $SCRIPT_DIR/backup_db.sh"
echo "  3. Test restore: $SCRIPT_DIR/restore_db_test.sh"
echo "  4. Setup automated schedule (cron or systemd)"
echo ""
