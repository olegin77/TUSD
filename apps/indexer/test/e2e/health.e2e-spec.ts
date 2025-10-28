import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Health Checks (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return healthy status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
        });
    });

    it('should include service information', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('timestamp');
        });
    });

    it('should respond quickly (< 1000ms)', async () => {
      const start = Date.now();

      await request(app.getHttpServer()).get('/health').expect(200);

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('GET /metrics (Prometheus)', () => {
    it('should return Prometheus metrics', () => {
      return request(app.getHttpServer())
        .get('/metrics')
        .expect(200)
        .expect((res) => {
          expect(res.text).toContain('# HELP');
          expect(res.text).toContain('# TYPE');
        });
    });

    it('should include application metrics', () => {
      return request(app.getHttpServer())
        .get('/metrics')
        .expect(200)
        .expect((res) => {
          // Should include HTTP request metrics
          expect(res.text).toContain('http');
        });
    });
  });

  describe('Application Startup', () => {
    it('should initialize all modules successfully', () => {
      expect(app).toBeDefined();
      expect(app.getHttpServer()).toBeDefined();
    });

    it('should have database connection', async () => {
      // Test database connectivity through a simple query
      return request(app.getHttpServer())
        .get('/api/v1/pools')
        .expect((res) => {
          expect(res.status).toBeLessThan(500); // No 500 errors = DB connected
        });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', () => {
      return request(app.getHttpServer())
        .get('/api/v1/nonexistent')
        .expect(404);
    });

    it('should handle malformed JSON', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/wallet/login')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);
    });

    it('should handle very large payloads', () => {
      const largePayload = {
        data: 'x'.repeat(20 * 1024 * 1024), // 20MB
      };

      return request(app.getHttpServer())
        .post('/api/v1/auth/wallet/login')
        .send(largePayload)
        .expect((res) => {
          expect(res.status).toBeGreaterThanOrEqual(400);
        });
    });
  });

  describe('Performance', () => {
    it('should handle concurrent requests', async () => {
      const requests = [];

      for (let i = 0; i < 10; i++) {
        requests.push(request(app.getHttpServer()).get('/api/v1/pools'));
      }

      const responses = await Promise.all(requests);

      // All should succeed
      responses.forEach((res) => {
        expect(res.status).toBe(200);
      });
    });

    it('should maintain response times under load', async () => {
      const iterations = 20;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await request(app.getHttpServer()).get('/api/v1/pools').expect(200);
        times.push(Date.now() - start);
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);

      console.log(`Average response time: ${avgTime}ms`);
      console.log(`Max response time: ${maxTime}ms`);

      expect(avgTime).toBeLessThan(500); // Average < 500ms
      expect(maxTime).toBeLessThan(2000); // Max < 2s
    });
  });
});
