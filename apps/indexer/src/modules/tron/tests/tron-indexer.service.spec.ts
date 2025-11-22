import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TronIndexerService } from '../services/tron-indexer.service';
import { TronEventProcessor } from '../services/tron-event-processor.service';
import { PrismaService } from '../../../database/prisma.service';

describe('TronIndexerService', () => {
  let service: TronIndexerService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config: Record<string, any> = {
        TRON_NETWORK: 'nile',
        TRON_GRID_API_KEY: 'test-api-key',
        TRON_DEPOSIT_VAULT_ADDRESS: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
        TRON_INDEXER_AUTO_START: 'false', // Disable auto-start in tests
      };
      return config[key] ?? defaultValue;
    }),
  };

  const mockPrismaService = {
    $executeRaw: jest.fn(),
  };

  const mockEventProcessor = {
    processDepositVaultEvent: jest.fn(),
    processPriceFeedEvent: jest.fn(),
    processBridgeEvent: jest.fn(),
    processWexel721Event: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TronIndexerService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: TronEventProcessor,
          useValue: mockEventProcessor,
        },
      ],
    }).compile();

    service = module.get<TronIndexerService>(TronIndexerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('start', () => {
    it('should start the indexer', async () => {
      await service.start();
      const status = service.getStatus();

      expect(status.isRunning).toBe(true);
      expect(status.depositVaultAddress).toBe(
        'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
      );
    });

    it('should not start if already running', async () => {
      await service.start();
      await service.start(); // Second call should warn

      const status = service.getStatus();
      expect(status.isRunning).toBe(true);
    });
  });

  describe('stop', () => {
    it('should stop the indexer', async () => {
      await service.start();
      await service.stop();

      const status = service.getStatus();
      expect(status.isRunning).toBe(false);
    });
  });

  describe('getStatus', () => {
    it('should return indexer status', () => {
      const status = service.getStatus();

      expect(status).toHaveProperty('isRunning');
      expect(status).toHaveProperty('lastProcessedBlock');
      expect(status).toHaveProperty('depositVaultAddress');
      expect(status).toHaveProperty('priceFeedAddress');
      expect(status).toHaveProperty('bridgeProxyAddress');
    });
  });
});
