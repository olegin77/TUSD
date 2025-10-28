# Rate Limiting Configuration

## Overview

The API uses `@nestjs/throttler` for rate limiting to prevent abuse.

## Configuration

Default limits (configurable via environment variables):

```typescript
{
  ttl: 60,        // Time window in seconds
  limit: 100,     // Max requests per time window
}
```

## Environment Variables

```bash
THROTTLE_TTL=60      # Time window (seconds)
THROTTLE_LIMIT=100   # Max requests per window
```

## Custom Decorators

You can override limits for specific endpoints:

```typescript
@Throttle({ default: { ttl: 60, limit: 10 } })
@Post('expensive-operation')
async expensiveOperation() {
  // ...
}
```

## Excluded Routes

Some routes are excluded from rate limiting (e.g., health checks):

```typescript
@SkipThrottle()
@Get('health')
async health() {
  return { status: 'ok' };
}
```

## Response Headers

When rate limited, the API returns:

- Status: `429 Too Many Requests`
- Headers:
  - `X-RateLimit-Limit`: Max requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

## Future Enhancements

- [ ] Per-user rate limits (based on JWT)
- [ ] Different limits for authenticated vs anonymous users
- [ ] Redis-based distributed rate limiting
