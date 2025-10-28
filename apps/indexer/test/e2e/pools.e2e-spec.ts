import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/database/prisma.service';

describe('Pools API (e2e)', () => {
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

    // Seed test pools if needed
    await seedTestPools(prisma);
  });

  afterAll(async () => {
    await cleanupTestPools(prisma);
    await app.close();
  });

  describe('GET /api/v1/pools', () => {
    it('should return list of pools', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pools')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    it('should return pools with correct structure', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pools')
        .expect(200)
        .expect((res) => {
          const pool = res.body.data[0];
          expect(pool).toHaveProperty('id');
          expect(pool).toHaveProperty('apy_base_bp');
          expect(pool).toHaveProperty('lock_months');
          expect(pool).toHaveProperty('min_deposit_usd');
          expect(pool).toHaveProperty('total_liquidity');
          expect(pool).toHaveProperty('total_wexels');
          expect(pool).toHaveProperty('is_active');
        });
    });

    it('should only return active pools by default', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pools')
        .expect(200)
        .expect((res) => {
          const pools = res.body.data;
          pools.forEach((pool: any) => {
            expect(pool.is_active).toBe(true);
          });
        });
    });

    it('should filter pools by active status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pools?is_active=false')
        .expect(200)
        .expect((res) => {
          const pools = res.body.data;
          pools.forEach((pool: any) => {
            expect(pool.is_active).toBe(false);
          });
        });
    });
  });

  describe('GET /api/v1/pools/:id', () => {
    it('should return specific pool by ID', async () => {
      const poolsRes = await request(app.getHttpServer())
        .get('/api/v1/pools')
        .expect(200);

      const firstPool = poolsRes.body.data[0];

      return request(app.getHttpServer())
        .get(`/api/v1/pools/${firstPool.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(firstPool.id);
        });
    });

    it('should return 404 for non-existent pool', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pools/999999')
        .expect(404);
    });

    it('should reject invalid pool ID format', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pools/invalid')
        .expect(400);
    });
  });

  describe('GET /api/v1/pools/:id/stats', () => {
    it('should return pool statistics', async () => {
      const poolsRes = await request(app.getHttpServer())
        .get('/api/v1/pools')
        .expect(200);

      const firstPool = poolsRes.body.data[0];

      return request(app.getHttpServer())
        .get(`/api/v1/pools/${firstPool.id}/stats`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('total_liquidity');
          expect(res.body.data).toHaveProperty('total_wexels');
          expect(res.body.data).toHaveProperty('apy_effective');
        });
    });
  });

  describe('Pool APY Calculations', () => {
    it('should have valid APY ranges', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pools')
        .expect(200)
        .expect((res) => {
          const pools = res.body.data;
          pools.forEach((pool: any) => {
            expect(pool.apy_base_bp).toBeGreaterThanOrEqual(0);
            expect(pool.apy_base_bp).toBeLessThanOrEqual(10000); // Max 100%
            expect(pool.boost_max_bp).toBeGreaterThanOrEqual(0);
            expect(pool.boost_max_bp).toBeLessThanOrEqual(2000); // Max 20% boost
          });
        });
    });
  });

  describe('Pool Lock Periods', () => {
    it('should have valid lock periods', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pools')
        .expect(200)
        .expect((res) => {
          const pools = res.body.data;
          pools.forEach((pool: any) => {
            expect(pool.lock_months).toBeGreaterThanOrEqual(12);
            expect(pool.lock_months).toBeLessThanOrEqual(36);
          });
        });
    });
  });
});

// Helper functions
async function seedTestPools(prisma: PrismaService) {
  try {
    // Check if pools already exist
    const existingPools = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM pools
    `;

    if ((existingPools as any)[0].count === 0) {
      // Create test pools
      await prisma.$executeRaw`
        INSERT INTO pools (apy_base_bp, lock_months, min_deposit_usd, is_active)
        VALUES 
          (1800, 12, 1000000000, true),
          (2100, 24, 1000000000, true),
          (2400, 36, 1000000000, true)
        ON CONFLICT DO NOTHING
      `;
    }
  } catch (error) {
    console.error('Error seeding test pools:', error);
  }
}

async function cleanupTestPools(prisma: PrismaService) {
  // Optionally clean up test data
  // For now, leave test pools as they don't interfere
}
