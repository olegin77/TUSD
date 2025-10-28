import { Test, TestingModule } from '@nestjs/testing';
import { TronIndexerService } from '../../src/modules/tron/services/tron-indexer.service';
import { TronEventProcessor } from '../../src/modules/tron/services/tron-event-processor.service';
import { TronBridgeService } from '../../src/modules/tron/services/tron-bridge.service';
import { PrismaService } from '../../src/database/prisma.service';
import { ConfigModule } from '@nestjs/config';

describe('Tron Bridge Integration', () => {
  let indexerService: TronIndexerService;
  let eventProcessor: TronEventProcessor;
  let bridgeService: TronBridgeService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      providers: [
        TronIndexerService,
        TronEventProcessor,
        TronBridgeService,
        PrismaService,
      ],
    }).compile();

    indexerService = module.get<TronIndexerService>(TronIndexerService);
    eventProcessor = module.get<TronEventProcessor>(TronEventProcessor);
    bridgeService = module.get<TronBridgeService>(TronBridgeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('Complete Deposit Flow', () => {
    it('should process Tron deposit and create bridge message', async () => {
      const mockDepositEvent = {
        event_name: 'DepositCreated',
        transaction_id: '0x' + 'a'.repeat(64),
        result: {
          depositId: '12345',
          depositor: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
          poolId: 1,
          amount: '1000000000', // 1000 USDT (6 decimals)
          solanaOwner: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
          timestamp: Math.floor(Date.now() / 1000),
        },
      };

      // Process the deposit event
      await eventProcessor.processDepositVaultEvent(mockDepositEvent);

      // Verify deposit was stored in database
      const deposit = await prisma.$queryRaw`
        SELECT * FROM tron_deposits WHERE deposit_id = ${mockDepositEvent.result.depositId}
      `;

      expect(deposit).toBeDefined();
      expect((deposit as any)[0]).toMatchObject({
        deposit_id: '12345',
        depositor: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
        pool_id: 1,
      });
    });

    it('should handle DepositProcessed event correctly', async () => {
      const mockProcessedEvent = {
        event_name: 'DepositProcessed',
        transaction_id: '0x' + 'b'.repeat(64),
        result: {
          depositId: '12345',
          wexelId: 'wexel-12345',
        },
      };

      await eventProcessor.processDepositVaultEvent(mockProcessedEvent);

      // Verify deposit was marked as processed
      const deposit = await prisma.$queryRaw`
        SELECT * FROM tron_deposits WHERE deposit_id = ${mockProcessedEvent.result.depositId}
      `;

      expect((deposit as any)[0].processed).toBe(true);
      expect((deposit as any)[0].wexel_id).toBe('wexel-12345');
    });
  });

  describe('Bridge Service Integration', () => {
    it('should create bridge message for deposit', async () => {
      const depositParams = {
        depositId: '99999',
        tronAddress: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
        solanaOwner: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
        amount: '500000000',
        poolId: 2,
      };

      const result = await bridgeService.bridgeDepositToSolana(depositParams);

      expect(result.success).toBe(true);
      expect(result.depositId).toBe(depositParams.depositId);
    });

    it('should get bridge status for deposit', async () => {
      const status = await bridgeService.getBridgeStatus('99999');

      expect(status).toHaveProperty('depositId');
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('confirmations');
      expect(status).toHaveProperty('requiredConfirmations');
    });

    it('should get bridge statistics', async () => {
      const stats = await bridgeService.getBridgeStats();

      expect(stats).toHaveProperty('totalBridged');
      expect(stats).toHaveProperty('totalAmount');
      expect(stats).toHaveProperty('pendingMessages');
      expect(stats).toHaveProperty('completedMessages');
      expect(stats.totalBridged).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Event Processing Integration', () => {
    it('should process PriceUpdated event', async () => {
      const mockPriceEvent = {
        event_name: 'PriceUpdated',
        transaction_id: '0x' + 'c'.repeat(64),
        result: {
          token: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT on Tron
          price: '1000000', // $1.00
          confidence: '99',
          timestamp: Math.floor(Date.now() / 1000),
        },
      };

      await eventProcessor.processPriceFeedEvent(mockPriceEvent);

      // Should not throw error
      expect(true).toBe(true);
    });

    it('should process MessageCreated event', async () => {
      const mockMessageEvent = {
        event_name: 'MessageCreated',
        transaction_id: '0x' + 'd'.repeat(64),
        result: {
          messageId: 'msg-123',
          messageType: 'DEPOSIT',
          sourceChain: 'TRON',
          targetChain: 'SOLANA',
          payload: JSON.stringify({ depositId: '12345' }),
        },
      };

      await eventProcessor.processBridgeEvent(mockMessageEvent);

      // Should not throw error
      expect(true).toBe(true);
    });
  });

  describe('Indexer Service Integration', () => {
    it('should start and stop indexer', async () => {
      await indexerService.start();

      let status = indexerService.getStatus();
      expect(status.isRunning).toBe(true);

      await indexerService.stop();

      status = indexerService.getStatus();
      expect(status.isRunning).toBe(false);
    });

    it('should return correct indexer status', () => {
      const status = indexerService.getStatus();

      expect(status).toHaveProperty('isRunning');
      expect(status).toHaveProperty('lastProcessedBlock');
      expect(status).toHaveProperty('depositVaultAddress');
      expect(status).toHaveProperty('priceFeedAddress');
      expect(status).toHaveProperty('bridgeProxyAddress');
      expect(status).toHaveProperty('wexel721Address');
    });
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.$executeRaw`
      DELETE FROM tron_deposits WHERE deposit_id IN ('12345', '99999')
    `;

    await prisma.$disconnect();
  });
});
