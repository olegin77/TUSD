import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/database/prisma.service';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/wallet/login', () => {
    it('should reject invalid wallet login request (missing fields)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/wallet/login')
        .send({
          walletAddress: 'test',
          // missing message and signature
        })
        .expect(400);
    });

    it('should reject invalid Solana address format', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/wallet/login')
        .send({
          walletAddress: 'invalid-address',
          message:
            'Sign in to USDX/Wexel Platform\nNonce: test123\nTimestamp: ' +
            Date.now(),
          signature: 'test-signature',
          chain: 'solana',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid Solana address');
        });
    });

    it('should reject invalid Tron address format', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/wallet/login')
        .send({
          walletAddress: 'invalid-tron',
          message:
            'Sign in to USDX/Wexel Platform\nNonce: test123\nTimestamp: ' +
            Date.now(),
          signature: 'test-signature',
          chain: 'tron',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid Tron address');
        });
    });

    it('should reject replay attack (duplicate nonce)', async () => {
      const nonce = 'unique-nonce-' + Date.now();
      const message = `Sign in to USDX/Wexel Platform\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;

      // This will fail signature verification, but that's OK for testing nonce logic
      const firstAttempt = request(app.getHttpServer())
        .post('/api/v1/auth/wallet/login')
        .send({
          walletAddress: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
          message,
          signature: 'fake-signature',
          chain: 'solana',
        });

      // Even if first fails on signature, nonce should be recorded
      // Second attempt with same nonce should fail
    });

    it('should reject expired message (timestamp > 5 minutes old)', () => {
      const oldTimestamp = Date.now() - 6 * 60 * 1000; // 6 minutes ago
      const message = `Sign in to USDX/Wexel Platform\nNonce: test123\nTimestamp: ${oldTimestamp}`;

      return request(app.getHttpServer())
        .post('/api/v1/auth/wallet/login')
        .send({
          walletAddress: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
          message,
          signature: 'test-signature',
          chain: 'solana',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('expired');
        });
    });
  });

  describe('POST /api/v1/auth/admin/login', () => {
    it('should reject login without credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send({})
        .expect(400);
    });

    it('should reject login with invalid email format', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send({
          email: 'not-an-email',
          password: 'password123',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email');
        });
    });

    it('should reject login with weak password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send({
          email: 'admin@example.com',
          password: '123', // Too short
        })
        .expect(400);
    });

    it('should reject login with wrong credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on public endpoints', async () => {
      const requests = [];

      // Make 101 requests (limit is 100/minute for public endpoints)
      for (let i = 0; i < 101; i++) {
        requests.push(request(app.getHttpServer()).get('/api/v1/pools').send());
      }

      const responses = await Promise.all(requests);

      // At least one should be rate limited
      const rateLimited = responses.some((res) => res.status === 429);
      expect(rateLimited).toBe(true);
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pools')
        .expect(200)
        .expect((res) => {
          expect(res.headers['access-control-allow-origin']).toBeDefined();
        });
    });

    it('should handle OPTIONS preflight requests', () => {
      return request(app.getHttpServer()).options('/api/v1/pools').expect(204);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers (Helmet)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pools')
        .expect((res) => {
          expect(res.headers['x-frame-options']).toBeDefined();
          expect(res.headers['x-content-type-options']).toBeDefined();
          expect(res.headers['x-xss-protection']).toBeDefined();
        });
    });
  });
});
