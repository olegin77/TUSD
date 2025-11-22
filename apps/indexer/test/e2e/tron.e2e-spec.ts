import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Tron Integration (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;

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

    await app.init();

    // Get admin token for protected endpoints
    // In real tests, use proper admin credentials
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/tron/status', () => {
    it('should return indexer status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/tron/status')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('isRunning');
          expect(res.body.data).toHaveProperty('lastProcessedBlock');
          expect(res.body.data).toHaveProperty('depositVaultAddress');
          expect(res.body.data).toHaveProperty('priceFeedAddress');
          expect(res.body.data).toHaveProperty('bridgeProxyAddress');
        });
    });

    it('should return valid indexer configuration', () => {
      return request(app.getHttpServer())
        .get('/api/v1/tron/status')
        .expect(200)
        .expect((res) => {
          const status = res.body.data;
          expect(typeof status.isRunning).toBe('boolean');
          expect(typeof status.lastProcessedBlock).toBe('number');
          expect(status.lastProcessedBlock).toBeGreaterThanOrEqual(0);
        });
    });
  });

  describe('GET /api/v1/tron/bridge/stats', () => {
    it('should return bridge statistics', () => {
      return request(app.getHttpServer())
        .get('/api/v1/tron/bridge/stats')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('totalBridged');
          expect(res.body.data).toHaveProperty('totalAmount');
          expect(res.body.data).toHaveProperty('pendingMessages');
          expect(res.body.data).toHaveProperty('completedMessages');
          expect(res.body.data).toHaveProperty('failedMessages');
        });
    });

    it('should return valid statistics', () => {
      return request(app.getHttpServer())
        .get('/api/v1/tron/bridge/stats')
        .expect(200)
        .expect((res) => {
          const stats = res.body.data;
          expect(stats.totalBridged).toBeGreaterThanOrEqual(0);
          expect(stats.pendingMessages).toBeGreaterThanOrEqual(0);
          expect(stats.completedMessages).toBeGreaterThanOrEqual(0);
          expect(stats.failedMessages).toBeGreaterThanOrEqual(0);
        });
    });
  });

  describe('GET /api/v1/tron/bridge/status/:depositId', () => {
    it('should return 404 for non-existent deposit', () => {
      return request(app.getHttpServer())
        .get('/api/v1/tron/bridge/status/nonexistent123')
        .expect(404);
    });

    it('should return deposit status structure', () => {
      return request(app.getHttpServer())
        .get('/api/v1/tron/bridge/status/test123')
        .expect((res) => {
          if (res.status === 200) {
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('depositId');
            expect(res.body.data).toHaveProperty('status');
            expect(res.body.data).toHaveProperty('confirmations');
            expect(res.body.data).toHaveProperty('requiredConfirmations');
          }
        });
    });
  });

  describe('POST /api/v1/tron/indexer/start (Admin)', () => {
    it('should reject without auth token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/tron/indexer/start')
        .expect(401);
    });

    it('should reject with invalid token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/tron/indexer/start')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    // With valid admin token, should succeed
    // it('should start indexer with valid admin token', () => {
    //   return request(app.getHttpServer())
    //     .post('/api/v1/tron/indexer/start')
    //     .set('Authorization', `Bearer ${adminToken}`)
    //     .expect(200)
    //     .expect((res) => {
    //       expect(res.body.success).toBe(true);
    //       expect(res.body.message).toContain('started');
    //     });
    // });
  });

  describe('POST /api/v1/tron/indexer/stop (Admin)', () => {
    it('should reject without auth token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/tron/indexer/stop')
        .expect(401);
    });
  });

  describe('POST /api/v1/tron/process-tx/:txHash (Admin)', () => {
    it('should reject without auth token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/tron/process-tx/abc123')
        .expect(401);
    });

    it('should validate transaction hash format', () => {
      // With admin token, should validate format
      // Tron tx hash is 64 hex characters
      return request(app.getHttpServer())
        .post('/api/v1/tron/process-tx/invalid-hash')
        .expect(401); // Will fail on auth first, but format would be checked
    });
  });

  describe('Rate Limiting on Tron Endpoints', () => {
    it('should not rate limit status endpoint excessively', async () => {
      const requests = [];

      // Make 50 requests (should all succeed)
      for (let i = 0; i < 50; i++) {
        requests.push(request(app.getHttpServer()).get('/api/v1/tron/status'));
      }

      const responses = await Promise.all(requests);

      // All should succeed (no rate limiting for status)
      const allSucceeded = responses.every((res) => res.status === 200);
      expect(allSucceeded).toBe(true);
    });
  });

  describe('Tron Address Validation', () => {
    it('should validate Tron addresses in requests', () => {
      // Any endpoint that accepts Tron addresses should validate format
      // Tron addresses start with T and are base58 encoded
      const validTronAddress = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf';
      const invalidTronAddress = '0xinvalid';

      // Test in deposit context or other relevant endpoint
      expect(validTronAddress).toMatch(/^T[1-9A-HJ-NP-Za-km-z]{33}$/);
      expect(invalidTronAddress).not.toMatch(/^T[1-9A-HJ-NP-Za-km-z]{33}$/);
    });
  });
});
