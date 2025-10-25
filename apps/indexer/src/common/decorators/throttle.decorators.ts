import { SetMetadata } from '@nestjs/common';

export const THROTTLE_KEY = 'throttle';

export interface ThrottleConfig {
  limit: number;
  ttl: number;
  skipIf?: (context: any) => boolean;
}

// General API rate limiting
export const Throttle = (limit: number, ttl: number) =>
  SetMetadata(THROTTLE_KEY, { limit, ttl });

// Strict rate limiting for sensitive operations
export const StrictThrottle = () =>
  SetMetadata(THROTTLE_KEY, { limit: 5, ttl: 60000 }); // 5 requests per minute

// Loose rate limiting for public endpoints
export const LooseThrottle = () =>
  SetMetadata(THROTTLE_KEY, { limit: 1000, ttl: 60000 }); // 1000 requests per minute

// Authentication rate limiting
export const AuthThrottle = () =>
  SetMetadata(THROTTLE_KEY, { limit: 5, ttl: 300000 }); // 5 attempts per 5 minutes

// Deposit/Withdrawal rate limiting
export const FinancialThrottle = () =>
  SetMetadata(THROTTLE_KEY, { limit: 10, ttl: 300000 }); // 10 operations per 5 minutes

// Price query rate limiting
export const PriceThrottle = () =>
  SetMetadata(THROTTLE_KEY, { limit: 100, ttl: 60000 }); // 100 queries per minute

// Admin operations rate limiting
export const AdminThrottle = () =>
  SetMetadata(THROTTLE_KEY, { limit: 20, ttl: 60000 }); // 20 operations per minute
