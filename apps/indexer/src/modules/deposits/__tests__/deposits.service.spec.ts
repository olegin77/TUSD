import { Test, TestingModule } from '@nestjs/testing';
import { DepositsService } from '../deposits.service';
import { PrismaService } from '../../../database/prisma.service';

describe('DepositsService', () => {
  let service: DepositsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositsService,
        {
          provide: PrismaService,
          useValue: {
            deposit: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
            pool: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DepositsService>(DepositsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new deposit', async () => {
      const depositDto = {
        user_id: 1,
        pool_id: 1,
        amount_usd: BigInt(1000_000000),
        tx_hash: '0xabc123',
      };

      const expectedDeposit = {
        id: 1,
        ...depositDto,
        status: 'PENDING',
        created_at: new Date(),
      };

      jest
        .spyOn(prisma.deposit, 'create')
        .mockResolvedValue(expectedDeposit as any);

      const result = await service.create(depositDto as any);

      expect(result).toEqual(expectedDeposit);
      expect(prisma.deposit.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          user_id: depositDto.user_id,
          pool_id: depositDto.pool_id,
        }),
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated deposits', async () => {
      const mockDeposits = [
        {
          id: 1,
          user_id: 1,
          pool_id: 1,
          amount_usd: BigInt(1000_000000),
          status: 'CONFIRMED',
          created_at: new Date(),
        },
        {
          id: 2,
          user_id: 1,
          pool_id: 2,
          amount_usd: BigInt(2000_000000),
          status: 'PENDING',
          created_at: new Date(),
        },
      ];

      jest
        .spyOn(prisma.deposit, 'findMany')
        .mockResolvedValue(mockDeposits as any);
      jest.spyOn(prisma.deposit, 'count').mockResolvedValue(2);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockDeposits);
      expect(result.total).toBe(2);
      expect(prisma.deposit.findMany).toHaveBeenCalled();
    });

    it('should filter by status', async () => {
      const mockDeposits = [
        {
          id: 1,
          user_id: 1,
          pool_id: 1,
          amount_usd: BigInt(1000_000000),
          status: 'CONFIRMED',
          created_at: new Date(),
        },
      ];

      jest
        .spyOn(prisma.deposit, 'findMany')
        .mockResolvedValue(mockDeposits as any);
      jest.spyOn(prisma.deposit, 'count').mockResolvedValue(1);

      const result = await service.findAll({
        page: 1,
        limit: 10,
        status: 'CONFIRMED',
      });

      expect(result.data).toEqual(mockDeposits);
      expect(prisma.deposit.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'CONFIRMED',
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single deposit', async () => {
      const mockDeposit = {
        id: 1,
        user_id: 1,
        pool_id: 1,
        amount_usd: BigInt(1000_000000),
        status: 'CONFIRMED',
        created_at: new Date(),
      };

      jest
        .spyOn(prisma.deposit, 'findUnique')
        .mockResolvedValue(mockDeposit as any);

      const result = await service.findOne(1);

      expect(result).toEqual(mockDeposit);
      expect(prisma.deposit.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: expect.any(Object),
      });
    });

    it('should return null if deposit not found', async () => {
      jest.spyOn(prisma.deposit, 'findUnique').mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update deposit status', async () => {
      const updatedDeposit = {
        id: 1,
        user_id: 1,
        pool_id: 1,
        amount_usd: BigInt(1000_000000),
        status: 'CONFIRMED',
        created_at: new Date(),
      };

      jest
        .spyOn(prisma.deposit, 'update')
        .mockResolvedValue(updatedDeposit as any);

      const result = await service.update(1, { status: 'CONFIRMED' } as any);

      expect(result).toEqual(updatedDeposit);
      expect(prisma.deposit.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'CONFIRMED' },
      });
    });
  });

  describe('getUserDeposits', () => {
    it('should return all deposits for a user', async () => {
      const mockDeposits = [
        {
          id: 1,
          user_id: 1,
          pool_id: 1,
          amount_usd: BigInt(1000_000000),
          status: 'CONFIRMED',
          created_at: new Date(),
        },
      ];

      jest
        .spyOn(prisma.deposit, 'findMany')
        .mockResolvedValue(mockDeposits as any);

      const result = await service.getUserDeposits(1);

      expect(result).toEqual(mockDeposits);
      expect(prisma.deposit.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 },
        include: expect.any(Object),
        orderBy: { created_at: 'desc' },
      });
    });
  });

  describe('getStats', () => {
    it('should calculate deposit statistics', async () => {
      const mockStats = {
        totalDeposits: 5,
        totalAmount: BigInt(10000_000000),
        confirmedDeposits: 3,
        pendingDeposits: 2,
      };

      // Mock implementation
      jest.spyOn(service, 'getStats').mockResolvedValue(mockStats as any);

      const result = await service.getStats();

      expect(result.totalDeposits).toBe(5);
      expect(result.confirmedDeposits).toBe(3);
    });
  });
});
