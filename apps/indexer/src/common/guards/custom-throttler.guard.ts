import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): string {
    // Use IP address as primary tracker
    const ip = this.getIpAddress(req);

    // For authenticated users, also consider user ID
    const userId = (req as any).user?.id;
    if (userId) {
      return `user:${userId}:${ip}`;
    }

    return ip;
  }

  protected getIpAddress(req: Request): string {
    // Check for forwarded IP (from load balancer/proxy)
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    }

    // Check for real IP header
    const realIp = req.headers['x-real-ip'];
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }

    // Fallback to connection remote address
    return (
      req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown'
    );
  }

  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const { req, res } = this.getRequestResponse(context);
    const tracker = this.getTracker(req);
    const key = this.generateKey(context, tracker);

    const totalHits = await this.storageService.increment(key, ttl);

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - totalHits));
    res.setHeader(
      'X-RateLimit-Reset',
      new Date(Date.now() + ttl * 1000).toISOString(),
    );

    if (totalHits > limit) {
      // Log rate limit exceeded
      console.warn(
        `Rate limit exceeded for ${tracker} on ${req.method} ${req.url}`,
      );
      return false;
    }

    return true;
  }
}
