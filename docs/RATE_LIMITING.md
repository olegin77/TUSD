# Rate Limiting Strategy

## Overview

This document outlines the rate limiting strategy for the USDX/Wexel Platform API, ensuring fair usage, preventing abuse, and maintaining system stability.

## Rate Limiting Tiers

### 1. Global Rate Limiting

- **Limit**: 100 requests per minute
- **Scope**: All API endpoints
- **Purpose**: Prevent general abuse and ensure fair usage

### 2. Authentication Rate Limiting

- **Limit**: 5 attempts per 5 minutes
- **Scope**: Login, registration, password reset
- **Purpose**: Prevent brute force attacks

### 3. Financial Operations Rate Limiting

- **Limit**: 10 operations per 5 minutes
- **Scope**: Deposits, withdrawals, collateral operations
- **Purpose**: Prevent rapid financial transactions

### 4. Price Query Rate Limiting

- **Limit**: 100 queries per minute
- **Scope**: Price oracle endpoints
- **Purpose**: Prevent excessive price queries

### 5. Admin Operations Rate Limiting

- **Limit**: 20 operations per minute
- **Scope**: Admin-only endpoints
- **Purpose**: Prevent admin abuse

### 6. Strict Rate Limiting

- **Limit**: 5 requests per minute
- **Scope**: Sensitive operations (boost application, collateral)
- **Purpose**: Prevent rapid sensitive operations

## Implementation Details

### Custom Throttler Guard

- Uses IP address as primary tracker
- For authenticated users, combines user ID with IP
- Handles forwarded IP addresses from load balancers
- Adds rate limit headers to responses

### Rate Limit Headers

All responses include rate limiting information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2024-12-01T10:31:00.000Z
```

### Tracking Methods

1. **IP-based tracking**: Primary method for anonymous users
2. **User-based tracking**: For authenticated users (user:userId:ip)
3. **Endpoint-specific tracking**: Different limits for different operations

## Usage Examples

### Controller Level

```typescript
@Controller("pools")
@Throttle(50, 60000) // 50 requests per minute
export class PoolsController {
  // ...
}
```

### Method Level

```typescript
@Post('deposit')
@FinancialThrottle() // 10 operations per 5 minutes
async deposit(@Body() dto: CreateDepositDto) {
  // ...
}
```

### Custom Throttling

```typescript
@Post('boost')
@Throttle(5, 300000) // 5 requests per 5 minutes
async applyBoost(@Body() dto: ApplyBoostDto) {
  // ...
}
```

## Rate Limiting Decorators

### Predefined Decorators

- `@StrictThrottle()`: 5 requests per minute
- `@LooseThrottle()`: 1000 requests per minute
- `@AuthThrottle()`: 5 attempts per 5 minutes
- `@FinancialThrottle()`: 10 operations per 5 minutes
- `@PriceThrottle()`: 100 queries per minute
- `@AdminThrottle()`: 20 operations per minute

### Custom Decorators

```typescript
@Throttle(limit, ttl) // Custom limit and TTL
```

## Error Handling

### Rate Limit Exceeded Response

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests",
  "error": "Too Many Requests",
  "timestamp": "2024-12-01T10:30:00.000Z",
  "path": "/api/v1/pools",
  "requestId": "req_123456789"
}
```

### Headers on Rate Limit Exceeded

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2024-12-01T10:31:00.000Z
Retry-After: 60
```

## Configuration

### Environment Variables

```env
# Rate limiting configuration
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
THROTTLE_AUTH_TTL=300000
THROTTLE_AUTH_LIMIT=5
THROTTLE_FINANCIAL_TTL=300000
THROTTLE_FINANCIAL_LIMIT=10
```

### Redis Configuration

Rate limiting uses Redis for distributed rate limiting:

```env
REDIS_URL=redis://localhost:6379
```

## Monitoring and Analytics

### Metrics Tracked

- Rate limit hits per endpoint
- Rate limit hits per user/IP
- Rate limit effectiveness
- Peak usage patterns

### Alerts

- High rate limit hit rates
- Unusual traffic patterns
- Potential DDoS attacks

## Best Practices

### 1. Client Implementation

- Always check rate limit headers
- Implement exponential backoff
- Cache responses when possible
- Use appropriate request intervals

### 2. Server Configuration

- Monitor rate limit effectiveness
- Adjust limits based on usage patterns
- Implement IP whitelisting for trusted sources
- Use different limits for different environments

### 3. Error Handling

- Provide clear error messages
- Include retry information
- Log rate limit violations
- Monitor for abuse patterns

## Testing Rate Limits

### Unit Tests

```typescript
describe("Rate Limiting", () => {
  it("should enforce rate limits", async () => {
    // Test rate limit enforcement
  });

  it("should reset rate limits after TTL", async () => {
    // Test rate limit reset
  });
});
```

### Integration Tests

```typescript
describe("API Rate Limiting", () => {
  it("should return 429 when rate limit exceeded", async () => {
    // Test rate limit exceeded response
  });
});
```

## Troubleshooting

### Common Issues

1. **Rate limits too strict**: Adjust limits in configuration
2. **Rate limits not working**: Check Redis connection
3. **False positives**: Verify IP tracking logic
4. **Performance impact**: Monitor Redis performance

### Debugging

- Check rate limit headers in responses
- Monitor Redis keys for rate limiting
- Review logs for rate limit violations
- Analyze traffic patterns

## Future Enhancements

### Planned Features

- Dynamic rate limiting based on user behavior
- Geographic rate limiting
- API key-based rate limiting
- Rate limiting analytics dashboard
- A/B testing for rate limit effectiveness
