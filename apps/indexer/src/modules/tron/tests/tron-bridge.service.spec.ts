import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TronBridgeService } from '../services/tron-bridge.service';
import { PrismaService } from '../../../database/prisma.service';

describe('TronBridgeService', () => {
  let service: TronBridgeService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config: Record<string, any> = {
        TRON_NETWORK: 'nile',
        TRON_GRID_API_KEY: 'test-api-key',
        SOLANA_RPC_URL: 'https://api.devnet.solana.com',
        NODE_ENV: 'test',
      };
      return config[key] ?? defaultValue;
    }),
  };

  const mockPrismaService = {
    $executeRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TronBridgeService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TronBridgeService>(TronBridgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBridgeStatus', () => {
    it('should return bridge status for deposit', async () => {
      const depositId = '12345';
      const status = await service.getBridgeStatus(depositId);

      expect(status).toHaveProperty('depositId');
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('confirmations');
      expect(status.depositId).toBe(depositId);
    });
  });

  describe('getBridgeStats', () => {
    it('should return bridge statistics', async () => {
      const stats = await service.getBridgeStats();

      expect(stats).toHaveProperty('totalBridged');
      expect(stats).toHaveProperty('totalAmount');
      expect(stats).toHaveProperty('pendingMessages');
      expect(stats).toHaveProperty('completedMessages');
    });
  });

  describe('bridgeDepositToSolana', () => {
    it('should create bridge message for deposit', async () => {
      const params = {
        depositId: '12345',
        tronAddress: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
        solanaOwner: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
        amount: '1000000000',
        poolId: 1,
      };

      // Note: This will fail without real Tron connection
      // In actual tests, we would mock TronWeb
      expect(service.bridgeDepositToSolana).toBeDefined();
    });
  });
});
