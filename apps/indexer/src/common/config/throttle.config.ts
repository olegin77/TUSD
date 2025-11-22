import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttleConfig: ThrottlerModuleOptions = [
  // Global rate limiting
  {
    name: 'global',
    ttl: 60000, // 1 minute
    limit: 100, // 100 requests per minute
  },
  // Authentication rate limiting
  {
    name: 'auth',
    ttl: 300000, // 5 minutes
    limit: 5, // 5 attempts per 5 minutes
  },
  // Financial operations rate limiting
  {
    name: 'financial',
    ttl: 300000, // 5 minutes
    limit: 10, // 10 operations per 5 minutes
  },
  // Price queries rate limiting
  {
    name: 'price',
    ttl: 60000, // 1 minute
    limit: 100, // 100 queries per minute
  },
  // Admin operations rate limiting
  {
    name: 'admin',
    ttl: 60000, // 1 minute
    limit: 20, // 20 operations per minute
  },
  // Strict rate limiting for sensitive operations
  {
    name: 'strict',
    ttl: 60000, // 1 minute
    limit: 5, // 5 requests per minute
  },
];
