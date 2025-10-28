import { Injectable, Logger } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { PrismaService } from '../../../database/prisma.service';
import { EventProcessorService } from './event-processor.service';

@Injectable()
export class SolanaIndexerService {
  private readonly logger = new Logger(SolanaIndexerService.name);
  private connection: Connection;
  private isRunning = false;
  private subscriptionIds: number[] = [];

  // Program IDs from environment
  private readonly programIds = {
    pool: process.env.SOLANA_POOL_PROGRAM_ID,
    wexel: process.env.SOLANA_WEXEL_NFT_PROGRAM_ID,
    rewards: process.env.SOLANA_REWARDS_PROGRAM_ID,
    collateral: process.env.SOLANA_COLLATERAL_PROGRAM_ID,
    marketplace: process.env.SOLANA_MARKETPLACE_PROGRAM_ID,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventProcessor: EventProcessorService,
  ) {
    const rpcUrl =
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    this.connection = new Connection(rpcUrl, {
      commitment: 'confirmed',
      wsEndpoint: process.env.SOLANA_WEBSOCKET_URL,
    });
  }

  /**
   * Start indexing Solana events
   */
  async start() {
    if (this.isRunning) {
      this.logger.warn('Solana indexer is already running');
      return;
    }

    this.logger.log('Starting Solana event indexer...');
    this.isRunning = true;

    // Subscribe to each program
    for (const [name, programId] of Object.entries(this.programIds)) {
      if (!programId) {
        this.logger.warn(`${name} program ID not configured, skipping`);
        continue;
      }

      try {
        await this.subscribeToProgramLogs(name, new PublicKey(programId));
      } catch (error) {
        this.logger.error(`Failed to subscribe to ${name} program`, error);
      }
    }

    this.logger.log('Solana indexer started successfully');
  }

  /**
   * Stop indexing
   */
  async stop() {
    this.logger.log('Stopping Solana indexer...');
    this.isRunning = false;

    // Remove all subscriptions
    for (const subId of this.subscriptionIds) {
      try {
        await this.connection.removeOnLogsListener(subId);
      } catch (error) {
        this.logger.error(`Failed to remove subscription ${subId}`, error);
      }
    }

    this.subscriptionIds = [];
    this.logger.log('Solana indexer stopped');
  }

  /**
   * Subscribe to program logs
   */
  private async subscribeToProgramLogs(
    programName: string,
    programId: PublicKey,
  ) {
    this.logger.log(
      `Subscribing to ${programName} program: ${programId.toString()}`,
    );

    const subscriptionId = this.connection.onLogs(
      programId,
      async (logs, context) => {
        try {
          await this.handleProgramLogs(programName, logs, context);
        } catch (error) {
          this.logger.error(`Error processing logs for ${programName}`, error);
        }
      },
      'confirmed',
    );

    this.subscriptionIds.push(subscriptionId);
    this.logger.log(`Subscribed to ${programName} with ID ${subscriptionId}`);
  }

  /**
   * Handle program logs
   */
  private async handleProgramLogs(
    programName: string,
    logs: any,
    context: any,
  ) {
    const signature = logs.signature;
    this.logger.debug(`New transaction for ${programName}: ${signature}`);

    // Check if already processed
    const existing = await this.prisma.blockchainEvent.findFirst({
      where: {
        tx_hash: signature,
        chain: 'solana',
      },
    });

    if (existing) {
      this.logger.debug(`Transaction ${signature} already processed`);
      return;
    }

    // Parse logs for events
    const events = this.parseEvents(logs.logs);

    // Store raw event
    await this.prisma.blockchainEvent.create({
      data: {
        chain: 'solana',
        tx_hash: signature,
        event_type: programName,
        data: {
          logs: logs.logs,
          err: logs.err,
          slot: context.slot,
          events: events,
        },
        processed: false,
      },
    });

    // Process events
    for (const event of events) {
      await this.eventProcessor.processEvent({
        chain: 'solana',
        txHash: signature,
        eventType: event.name,
        data: event.data,
        slot: context.slot,
      });
    }

    // Mark as processed
    await this.prisma.blockchainEvent.updateMany({
      where: {
        tx_hash: signature,
        chain: 'solana',
      },
      data: {
        processed: true,
      },
    });
  }

  /**
   * Parse events from logs
   * Format: "Program log: EVENT_NAME: {json_data}"
   */
  private parseEvents(logs: string[]): any[] {
    const events: any[] = [];

    for (const log of logs) {
      // Look for event logs
      if (log.includes('Program log:')) {
        try {
          // Extract event data
          // Example: "Program log: WexelCreated: {\"id\":1,\"owner\":\"...\"}"
          const match = log.match(/Program log: (\w+): ({.+})/);
          if (match) {
            const [, eventName, jsonData] = match;
            const data = JSON.parse(jsonData);
            events.push({
              name: eventName,
              data: data,
            });
          }
        } catch (error) {
          this.logger.warn(`Failed to parse event from log: ${log}`, error);
        }
      }
    }

    return events;
  }

  /**
   * Get indexer status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeSubscriptions: this.subscriptionIds.length,
      rpcUrl: this.connection.rpcEndpoint,
      programIds: this.programIds,
    };
  }

  /**
   * Manually fetch and index transaction
   */
  async indexTransaction(signature: string) {
    this.logger.log(`Manually indexing transaction: ${signature}`);

    try {
      const tx = await this.connection.getTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      });

      if (!tx) {
        throw new Error('Transaction not found');
      }

      // Process transaction logs
      const logs = tx.meta?.logMessages || [];
      const events = this.parseEvents(logs);

      // Store event
      await this.prisma.blockchainEvent.create({
        data: {
          chain: 'solana',
          tx_hash: signature,
          event_type: 'manual',
          data: {
            logs: logs,
            events: events,
            slot: tx.slot,
          },
          processed: false,
        },
      });

      // Process events
      for (const event of events) {
        await this.eventProcessor.processEvent({
          chain: 'solana',
          txHash: signature,
          eventType: event.name,
          data: event.data,
          slot: tx.slot,
        });
      }

      // Mark as processed
      await this.prisma.blockchainEvent.updateMany({
        where: {
          tx_hash: signature,
          chain: 'solana',
        },
        data: {
          processed: true,
        },
      });

      this.logger.log(`Transaction ${signature} indexed successfully`);
      return { success: true, events: events.length };
    } catch (error) {
      this.logger.error(`Failed to index transaction ${signature}`, error);
      throw error;
    }
  }
}
