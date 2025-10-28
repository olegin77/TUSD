# Incident Response Runbook

## Purpose

Guide for responding to production incidents.

## Severity Levels

### P0 - Critical (Production Down)
- **Response Time**: Immediate
- **Examples**: API unavailable, data loss, security breach
- **Actions**: All hands on deck, immediate escalation

### P1 - High (Major Feature Broken)
- **Response Time**: < 15 minutes
- **Examples**: Wallet connection fails, deposits broken
- **Actions**: On-call engineer responds, team notified

### P2 - Medium (Minor Feature Broken)
- **Response Time**: < 1 hour
- **Examples**: UI bug, slow response times
- **Actions**: Normal response, fix in next release

### P3 - Low (Cosmetic Issue)
- **Response Time**: Next business day
- **Examples**: Styling issue, typo
- **Actions**: Log as bug, schedule fix

---

## P0 - Critical Incident Response

### Step 1: Alert & Assemble (T+0)

```bash
# Send alert
./scripts/send_alert.sh critical "INCIDENT: [Description]"

# Page on-call team
# Use PagerDuty or equivalent
```

**Actions:**
- [ ] Incident detected
- [ ] Alert sent
- [ ] On-call engineer paged
- [ ] Incident channel created (#incident-YYYY-MM-DD)
- [ ] Incident commander assigned

### Step 2: Assess (T+5)

```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs --tail=500 indexer | grep ERROR
docker-compose logs --tail=500 webapp | grep ERROR

# Check metrics
# Open Grafana dashboard

# Check external status
curl https://api.usdx-wexel.com/health
curl https://app.usdx-wexel.com/
```

**Questions:**
- What is broken?
- How many users affected?
- Is data at risk?
- What changed recently?

**Actions:**
- [ ] Scope determined
- [ ] Impact assessed
- [ ] Root cause hypothesis

### Step 3: Contain (T+10)

**If data at risk:**
```bash
# Pause blockchain operations
docker-compose exec indexer npm run pause:contracts

# Stop processing
docker-compose stop indexer
```

**If service unavailable:**
```bash
# Route to maintenance page
# Update DNS or load balancer

# Or enable maintenance mode
docker-compose exec indexer npm run maintenance:on
```

**Actions:**
- [ ] Further damage prevented
- [ ] Users notified (status page)
- [ ] Stakeholders notified

### Step 4: Diagnose (T+15)

```bash
# Check database
docker-compose exec db psql -U usdx -d usdx_wexel -c "
  SELECT * FROM pg_stat_activity WHERE state = 'active';
"

# Check for locks
docker-compose exec db psql -U usdx -d usdx_wexel -c "
  SELECT * FROM pg_locks WHERE NOT granted;
"

# Check disk space
docker-compose exec db df -h
docker-compose exec redis df -h

# Check memory
docker stats

# Review recent changes
git log --oneline -10
```

**Common Issues:**
- Database connection exhaustion
- Out of memory
- Disk full
- Bad deployment
- External service failure (RPC, oracle)

**Actions:**
- [ ] Root cause identified
- [ ] Fix strategy determined

### Step 5: Fix (T+30)

**Option A: Restart services**
```bash
docker-compose restart indexer webapp
```

**Option B: Rollback deployment**
```bash
./scripts/rollback.sh v1.x.x-prev
```

**Option C: Hotfix**
```bash
# Make fix
git checkout -b hotfix/issue-123
# ... make changes ...
git commit -m "hotfix: description"
git push

# Deploy hotfix
cd /opt/usdx-wexel
git pull
docker-compose build indexer
docker-compose up -d indexer
```

**Option D: Scale resources**
```bash
# Increase database connections
docker-compose exec db psql -U postgres -c "
  ALTER SYSTEM SET max_connections = 200;
"
docker-compose restart db

# Or scale to more instances (if using orchestration)
```

**Actions:**
- [ ] Fix applied
- [ ] Services restored
- [ ] Functionality verified

### Step 6: Verify (T+45)

```bash
# Run smoke tests
./scripts/test_deployment.sh production

# Check metrics
# Verify error rate dropped
# Verify response times normal

# Test critical paths
# - Wallet connection
# - Deposit flow
# - Marketplace
```

**Actions:**
- [ ] All services healthy
- [ ] Error rates normal
- [ ] Critical functionality verified
- [ ] Monitoring stable

### Step 7: Communicate (T+60)

```bash
# Update status page
./scripts/update_status.sh resolved "Issue resolved at HH:MM UTC"

# Notify users
./scripts/send_notification.sh all "Services restored. Thank you for your patience."
```

**Actions:**
- [ ] Status page updated (resolved)
- [ ] Users notified
- [ ] Stakeholders updated
- [ ] Incident timeline documented

### Step 8: Post-Mortem (T+24h)

**Actions:**
- [ ] Post-mortem meeting scheduled
- [ ] Timeline documented
- [ ] Root cause confirmed
- [ ] Action items identified
- [ ] Process improvements planned
- [ ] Post-mortem published

---

## P1 - High Severity Response

### Step 1: Respond (T+0)

- [ ] Acknowledge alert
- [ ] Notify team
- [ ] Start investigation

### Step 2: Assess (T+5)

- [ ] Identify broken feature
- [ ] Estimate impact
- [ ] Check for workaround

### Step 3: Fix (T+30)

- [ ] Apply fix or workaround
- [ ] Test fix
- [ ] Deploy to production

### Step 4: Verify (T+45)

- [ ] Feature restored
- [ ] Users notified
- [ ] Incident closed

---

## Common Scenarios

### Scenario: API Unavailable

**Symptoms:**
- API health check failing
- 502/503 errors
- Timeout errors

**Diagnosis:**
```bash
docker-compose logs indexer
docker-compose ps
netstat -tlnp | grep 3001
```

**Common Causes:**
- Service crashed
- Database connection issue
- Out of memory

**Fix:**
```bash
docker-compose restart indexer
# Or if OOM:
# Increase memory limit in docker-compose.yml
# docker-compose up -d indexer
```

### Scenario: Database Connection Exhausted

**Symptoms:**
- "Too many connections" errors
- Slow API responses
- Connection timeout errors

**Diagnosis:**
```bash
docker-compose exec db psql -U usdx -d usdx_wexel -c "
  SELECT count(*) FROM pg_stat_activity;
"
```

**Fix:**
```bash
# Kill idle connections
docker-compose exec db psql -U postgres -c "
  SELECT pg_terminate_backend(pid) 
  FROM pg_stat_activity 
  WHERE datname = 'usdx_wexel' 
  AND state = 'idle' 
  AND state_change < now() - interval '5 minutes';
"

# Increase max_connections
docker-compose exec db psql -U postgres -c "
  ALTER SYSTEM SET max_connections = 200;
"
docker-compose restart db
```

### Scenario: Blockchain Indexer Lagging

**Symptoms:**
- Events not showing in UI
- Indexer lag metric high
- Users report missing transactions

**Diagnosis:**
```bash
docker-compose logs indexer | grep "indexer lag"
docker-compose exec indexer npm run indexer:status
```

**Fix:**
```bash
# Check RPC connection
docker-compose exec indexer npm run rpc:ping

# Restart indexer
docker-compose restart indexer

# If still lagging, may need to catch up
# This can take hours depending on lag
```

### Scenario: Out of Disk Space

**Symptoms:**
- Database errors
- Log errors
- Application crashes

**Diagnosis:**
```bash
df -h
docker system df
```

**Fix:**
```bash
# Clean Docker
docker system prune -a -f

# Clean old logs
find /var/log -type f -name "*.log" -mtime +30 -delete

# Clean old backups
find /var/backups/usdx-wexel -type f -mtime +60 -delete

# If database partition full, may need to extend volume
```

---

## Escalation

### Level 1: On-Call Engineer
- Initial response
- Common fixes
- 0-30 minutes

### Level 2: Team Lead / Senior Engineer
- Complex issues
- Architecture decisions
- 30-60 minutes

### Level 3: CTO / Founders
- Business decisions
- Security incidents
- Major outages

### External: Infrastructure Provider
- Cloud platform issues
- Network problems
- Contact: support@provider.com

---

## Communication Templates

### Status Page - Investigating

```
We are currently investigating reports of [issue]. 
We will provide an update in 15 minutes.
```

### Status Page - Identified

```
We have identified the issue: [description].
Our team is working on a fix. ETA: [time].
```

### Status Page - Resolved

```
The issue has been resolved. All services are now operational.
We apologize for any inconvenience.
```

### User Notification - Major Incident

```
Subject: Service Disruption - [Date]

Dear Users,

We experienced a service disruption today from [time] to [time] UTC.
The issue was [description].

What happened: [brief explanation]
What we did: [actions taken]
Status: Resolved

We apologize for the inconvenience. If you have questions, 
please contact support@usdx-wexel.com.

Thank you for your patience.
The USDX/Wexel Team
```

---

## Post-Mortem Template

**Incident ID**: INC-YYYY-MM-DD-##  
**Date**: YYYY-MM-DD  
**Duration**: HH:MM (from alert to resolution)  
**Severity**: P0 / P1 / P2 / P3  
**Impact**: [Number] users affected

**Summary**:
[Brief description of what happened]

**Timeline** (all times UTC):
- HH:MM - Incident detected
- HH:MM - Team alerted
- HH:MM - Root cause identified
- HH:MM - Fix applied
- HH:MM - Services restored
- HH:MM - Incident closed

**Root Cause**:
[Detailed explanation]

**Resolution**:
[What was done to fix it]

**Action Items**:
- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]

**Lessons Learned**:
- What went well:
- What could be improved:
- What we learned:

**Prevention**:
[How we'll prevent this in the future]

---

## Contacts

- **On-Call Engineer**: PagerDuty
- **Team Lead**: [phone/email]
- **CTO**: [phone/email]
- **Security Lead**: security@usdx-wexel.com
- **Infrastructure Support**: [provider support]
- **Status Page**: https://status.usdx-wexel.com

---

**Last Updated**: 2024-12-28  
**Next Review**: 2025-03-28  
**Owner**: DevOps Team
