import { Test, TestingModule } from '@nestjs/testing';
import { PoolsService } from '../pools.service';
import { PrismaService } from '../../../database/prisma.service';

describe('PoolsService', () => {
  let service: PoolsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoolsService,
        {
          provide: PrismaService,
          useValue: {
            pool: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PoolsService>(PoolsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all active pools', async () => {
      const mockPools = [
        {
          id: 1,
          apy_base_bp: 1800,
          lock_months: 12,
          min_deposit_usd: BigInt(100_000000),
          is_active: true,
        },
        {
          id: 2,
          apy_base_bp: 2400,
          lock_months: 18,
          min_deposit_usd: BigInt(500_000000),
          is_active: true,
        },
      ];

      jest.spyOn(prisma.pool, 'findMany').mockResolvedValue(mockPools as any);

      const result = await service.findAll();

      expect(result).toEqual(mockPools);
      expect(prisma.pool.findMany).toHaveBeenCalledWith({
        where: { is_active: true },
        orderBy: { apy_base_bp: 'asc' },
      });
    });

    it('should include inactive pools when requested', async () => {
      const mockPools = [
        {
          id: 1,
          apy_base_bp: 1800,
          lock_months: 12,
          is_active: true,
        },
        {
          id: 3,
          apy_base_bp: 3000,
          lock_months: 24,
          is_active: false,
        },
      ];

      jest.spyOn(prisma.pool, 'findMany').mockResolvedValue(mockPools as any);

      const result = await service.findAll(false);

      expect(result).toEqual(mockPools);
      expect(prisma.pool.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { apy_base_bp: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single pool', async () => {
      const mockPool = {
        id: 1,
        apy_base_bp: 1800,
        lock_months: 12,
        min_deposit_usd: BigInt(100_000000),
        boost_target_bp: 3000,
        boost_max_bp: 500,
        is_active: true,
      };

      jest.spyOn(prisma.pool, 'findUnique').mockResolvedValue(mockPool as any);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPool);
      expect(prisma.pool.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if pool not found', async () => {
      jest.spyOn(prisma.pool, 'findUnique').mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new pool', async () => {
      const poolDto = {
        apy_base_bp: 1800,
        lock_months: 12,
        min_deposit_usd: BigInt(100_000000),
        boost_target_bp: 3000,
        boost_max_bp: 500,
        is_active: true,
      };

      const createdPool = {
        id: 1,
        ...poolDto,
        created_at: new Date(),
      };

      jest.spyOn(prisma.pool, 'create').mockResolvedValue(createdPool as any);

      const result = await service.create(poolDto as any);

      expect(result).toEqual(createdPool);
      expect(prisma.pool.create).toHaveBeenCalledWith({
        data: poolDto,
      });
    });
  });

  describe('update', () => {
    it('should update pool parameters', async () => {
      const updatedPool = {
        id: 1,
        apy_base_bp: 2000,
        lock_months: 12,
        min_deposit_usd: BigInt(100_000000),
        is_active: true,
      };

      jest.spyOn(prisma.pool, 'update').mockResolvedValue(updatedPool as any);

      const result = await service.update(1, { apy_base_bp: 2000 } as any);

      expect(result.apy_base_bp).toBe(2000);
      expect(prisma.pool.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { apy_base_bp: 2000 },
      });
    });
  });

  describe('calculateYield', () => {
    it('should calculate yield correctly', () => {
      const amount = BigInt(1000_000000); // $1000
      const apyBp = 1800; // 18%
      const lockMonths = 12;

      const expectedYield = (Number(amount) * apyBp) / 10000;

      const result = service.calculateYield(amount, apyBp, lockMonths);

      expect(Number(result)).toBeCloseTo(expectedYield, 2);
    });

    it('should calculate yield for partial periods', () => {
      const amount = BigInt(1000_000000); // $1000
      const apyBp = 2400; // 24%
      const lockMonths = 6; // Half year

      const yearlyYield = (Number(amount) * apyBp) / 10000;
      const expectedYield = (yearlyYield * lockMonths) / 12;

      const result = service.calculateYield(amount, apyBp, lockMonths);

      expect(Number(result)).toBeCloseTo(expectedYield, 2);
    });
  });

  describe('isDepositAllowed', () => {
    it('should allow deposit above minimum', async () => {
      const mockPool = {
        id: 1,
        min_deposit_usd: BigInt(100_000000),
        is_active: true,
      };

      jest.spyOn(prisma.pool, 'findUnique').mockResolvedValue(mockPool as any);

      const result = await service.isDepositAllowed(1, BigInt(200_000000));

      expect(result).toBe(true);
    });

    it('should reject deposit below minimum', async () => {
      const mockPool = {
        id: 1,
        min_deposit_usd: BigInt(100_000000),
        is_active: true,
      };

      jest.spyOn(prisma.pool, 'findUnique').mockResolvedValue(mockPool as any);

      const result = await service.isDepositAllowed(1, BigInt(50_000000));

      expect(result).toBe(false);
    });

    it('should reject deposit to inactive pool', async () => {
      const mockPool = {
        id: 1,
        min_deposit_usd: BigInt(100_000000),
        is_active: false,
      };

      jest.spyOn(prisma.pool, 'findUnique').mockResolvedValue(mockPool as any);

      const result = await service.isDepositAllowed(1, BigInt(200_000000));

      expect(result).toBe(false);
    });
  });
});
