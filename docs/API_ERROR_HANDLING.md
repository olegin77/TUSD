# API Error Handling Strategy

## Overview

This document outlines the error handling strategy for the USDX/Wexel Platform API, ensuring consistent error responses, proper logging, and effective monitoring.

## Error Response Format

All API errors follow a consistent JSON structure:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BadRequestException",
  "timestamp": "2024-12-01T10:30:00.000Z",
  "path": "/api/v1/pools",
  "requestId": "req_123456789"
}
```

### Fields Description

- `statusCode`: HTTP status code
- `message`: Human-readable error message or array of validation errors
- `error`: Error type/class name
- `timestamp`: ISO 8601 timestamp of the error
- `path`: API endpoint where the error occurred
- `requestId`: Unique request identifier (if provided in headers)

## Error Categories

### 1. Client Errors (4xx)

#### 400 Bad Request

- Validation errors
- Invalid request format
- Business logic violations

#### 401 Unauthorized

- Missing or invalid authentication
- Expired tokens

#### 403 Forbidden

- Insufficient permissions
- KYC requirements not met
- Wallet access denied

#### 404 Not Found

- Resource not found
- Invalid endpoints

#### 429 Too Many Requests

- Rate limit exceeded

### 2. Server Errors (5xx)

#### 500 Internal Server Error

- Unexpected server errors
- Database connection issues
- External service failures

## Business Logic Exceptions

### Pool Management

- `PoolNotFoundException`: Pool with specified ID not found
- `InsufficientFundsException`: Not enough funds for operation

### Wexel Management

- `WexelNotFoundException`: Wexel with specified ID not found
- `WexelAlreadyCollateralizedException`: Wexel is already in collateral
- `WexelNotCollateralizedException`: Wexel is not in collateral
- `WexelNotMaturedException`: Wexel has not reached maturity

### Boost System

- `BoostTargetExceededException`: Boost amount exceeds maximum allowed

### Price Oracle

- `InvalidPriceSourceException`: Invalid price source specified
- `PriceDeviationTooHighException`: Price deviation exceeds threshold

### Authentication & Authorization

- `UnauthorizedWalletException`: Wallet access denied
- `KYCRequiredException`: KYC verification required

## Error Handling Components

### 1. Global Exception Filter

- `HttpExceptionFilter`: Catches all exceptions and formats responses
- Integrates with Sentry for error tracking
- Sanitizes sensitive data in logs

### 2. Validation System

- DTO validation using `class-validator`
- Global validation pipe with transformation
- Custom validation decorators for business rules

### 3. Logging Strategy

- Structured logging with context
- Different log levels for different error types
- Request/response correlation via request IDs

### 4. Monitoring Integration

- Sentry integration for error tracking
- Performance monitoring
- Custom metrics for business logic errors

## Error Codes Reference

| Code | Error Type                 | Description                       |
| ---- | -------------------------- | --------------------------------- |
| 1001 | InsufficientFunds          | Not enough funds for operation    |
| 1002 | PoolNotFound               | Pool with specified ID not found  |
| 1003 | WexelNotFound              | Wexel with specified ID not found |
| 1004 | WexelAlreadyCollateralized | Wexel is already in collateral    |
| 1005 | WexelNotCollateralized     | Wexel is not in collateral        |
| 1006 | BoostTargetExceeded        | Boost amount exceeds maximum      |
| 1007 | WexelNotMatured            | Wexel has not reached maturity    |
| 1008 | InvalidPriceSource         | Invalid price source specified    |
| 1009 | PriceDeviationTooHigh      | Price deviation exceeds threshold |
| 1010 | UnauthorizedWallet         | Wallet access denied              |
| 1011 | KYCRequired                | KYC verification required         |

## Best Practices

### 1. Error Message Guidelines

- Use clear, actionable error messages
- Avoid exposing internal system details
- Provide context for debugging when appropriate

### 2. Logging Guidelines

- Log all errors with sufficient context
- Sanitize sensitive data before logging
- Use structured logging format

### 3. Monitoring Guidelines

- Track error rates by endpoint
- Monitor business logic error patterns
- Set up alerts for critical errors

### 4. Client Integration

- Always check status codes
- Handle validation errors gracefully
- Implement retry logic for transient errors

## Testing Error Scenarios

### Unit Tests

- Test all custom exception classes
- Verify error response format
- Test validation error handling

### Integration Tests

- Test error handling in API endpoints
- Verify Sentry integration
- Test rate limiting error responses

### E2E Tests

- Test complete error flows
- Verify client error handling
- Test error recovery scenarios
