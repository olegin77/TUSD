import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Load Testing', () => {
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

  describe('API Performance Under Load', () => {
    it('should handle 100 concurrent requests to /api/v1/pools', async () => {
      const concurrentRequests = 100;
      const requests = [];

      const startTime = Date.now();

      for (let i = 0; i < concurrentRequests; i++) {
        requests.push(
          request(app.getHttpServer())
            .get('/api/v1/pools')
            .expect(200)
        );
      }

      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // All requests should succeed
      expect(responses.every(r => r.status === 200)).toBe(true);

      // Average response time
      const avgResponseTime = duration / concurrentRequests;

      console.log(`
Load Test Results (100 concurrent requests):
  Total Duration: ${duration}ms
  Average Response Time: ${avgResponseTime.toFixed(2)}ms
  Requests Per Second: ${(concurrentRequests / (duration / 1000)).toFixed(2)}
      `);

      // Performance assertions
      expect(duration).toBeLessThan(30000); // All 100 requests < 30s
      expect(avgResponseTime).toBeLessThan(300); // Avg < 300ms
    });

    it('should maintain performance with sequential heavy requests', async () => {
      const iterations = 50;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        
        await request(app.getHttpServer())
          .get('/api/v1/pools')
          .expect(200);
        
        times.push(Date.now() - start);
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      const p95Time = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)];

      console.log(`
Sequential Load Test Results (50 requests):
  Average: ${avgTime.toFixed(2)}ms
  Min: ${minTime}ms
  Max: ${maxTime}ms
  P95: ${p95Time}ms
      `);

      expect(avgTime).toBeLessThan(500);
      expect(p95Time).toBeLessThan(1000);
    });

    it('should handle burst traffic', async () => {
      const bursts = 5;
      const requestsPerBurst = 20;
      const results: any[] = [];

      for (let burst = 0; burst < bursts; burst++) {
        const burstRequests = [];
        const burstStart = Date.now();

        for (let i = 0; i < requestsPerBurst; i++) {
          burstRequests.push(
            request(app.getHttpServer())
              .get('/api/v1/pools')
          );
        }

        const responses = await Promise.all(burstRequests);
        const burstDuration = Date.now() - burstStart;

        results.push({
          burst: burst + 1,
          duration: burstDuration,
          successRate: responses.filter(r => r.status === 200).length / requestsPerBurst,
        });

        // Small delay between bursts
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log('Burst Traffic Results:');
      results.forEach(r => {
        console.log(`  Burst ${r.burst}: ${r.duration}ms, Success: ${(r.successRate * 100).toFixed(1)}%`);
      });

      // All bursts should have high success rate
      results.forEach(r => {
        expect(r.successRate).toBeGreaterThan(0.9); // >90% success
      });
    });
  });

  describe('Database Performance', () => {
    it('should handle complex queries efficiently', async () => {
      const iterations = 20;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        
        await request(app.getHttpServer())
          .get('/api/v1/pools?include=wexels&include=deposits')
          .expect(200);
        
        times.push(Date.now() - start);
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;

      console.log(`Complex Query Average Time: ${avgTime.toFixed(2)}ms`);

      expect(avgTime).toBeLessThan(1000); // Complex queries < 1s
    });
  });

  describe('Memory Stability', () => {
    it('should not leak memory under sustained load', async () => {
      const initialMemory = process.memoryUsage();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        await request(app.getHttpServer())
          .get('/api/v1/pools')
          .expect(200);
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage();
      const heapGrowth = finalMemory.heapUsed - initialMemory.heapUsed;
      const heapGrowthMB = heapGrowth / 1024 / 1024;

      console.log(`
Memory Stability Test (${iterations} requests):
  Initial Heap: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)} MB
  Final Heap: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)} MB
  Growth: ${heapGrowthMB.toFixed(2)} MB
      `);

      // Heap growth should be minimal (<50MB for 100 requests)
      expect(heapGrowthMB).toBeLessThan(50);
    });
  });

  describe('Rate Limiting Effectiveness', () => {
    it('should properly enforce rate limits', async () => {
      const requests = [];
      const totalRequests = 150; // Over the limit

      for (let i = 0; i < totalRequests; i++) {
        requests.push(
          request(app.getHttpServer())
            .get('/api/v1/pools')
        );
      }

      const responses = await Promise.all(requests);
      
      const successCount = responses.filter(r => r.status === 200).length;
      const rateLimitedCount = responses.filter(r => r.status === 429).length;

      console.log(`
Rate Limiting Test (${totalRequests} requests):
  Successful: ${successCount}
  Rate Limited: ${rateLimitedCount}
  Success Rate: ${((successCount / totalRequests) * 100).toFixed(1)}%
      `);

      // Should have some rate limited requests
      expect(rateLimitedCount).toBeGreaterThan(0);
      
      // But should allow reasonable amount through
      expect(successCount).toBeGreaterThan(50);
    });
  });

  describe('Error Recovery', () => {
    it('should recover gracefully from errors', async () => {
      // Send some invalid requests
      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer())
          .get('/api/v1/pools/invalid-id')
          .expect(400);
      }

      // System should still respond to valid requests
      const response = await request(app.getHttpServer())
        .get('/api/v1/pools')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
