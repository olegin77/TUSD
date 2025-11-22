import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface ClientData {
  userId?: string;
  walletAddress?: string;
  subscriptions: Set<string>;
}

/**
 * WebSocket Gateway for real-time notifications
 *
 * Events:
 * - wexel:created - New wexel created
 * - wexel:boost_applied - Boost applied to wexel
 * - wexel:rewards_accrued - Rewards accrued
 * - wexel:claimed - Rewards claimed
 * - wexel:collateralized - Wexel collateralized
 * - wexel:loan_repaid - Loan repaid
 * - wexel:redeemed - Wexel redeemed
 * - marketplace:listing_created - New listing
 * - marketplace:listing_sold - Listing sold
 * - marketplace:listing_cancelled - Listing cancelled
 */
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private clients = new Map<string, ClientData>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, {
      subscriptions: new Set(),
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }

  /**
   * Subscribe to user-specific notifications
   */
  @SubscribeMessage('subscribe:user')
  handleSubscribeUser(
    @MessageBody() data: { walletAddress: string },
    @ConnectedSocket() client: Socket,
  ) {
    const clientData = this.clients.get(client.id);
    if (clientData) {
      clientData.walletAddress = data.walletAddress;
      clientData.subscriptions.add(`user:${data.walletAddress}`);
      this.logger.log(
        `Client ${client.id} subscribed to user: ${data.walletAddress}`,
      );
    }
    return { success: true, message: 'Subscribed to user notifications' };
  }

  /**
   * Subscribe to specific wexel notifications
   */
  @SubscribeMessage('subscribe:wexel')
  handleSubscribeWexel(
    @MessageBody() data: { wexelId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const clientData = this.clients.get(client.id);
    if (clientData) {
      clientData.subscriptions.add(`wexel:${data.wexelId}`);
      this.logger.log(
        `Client ${client.id} subscribed to wexel: ${data.wexelId}`,
      );
    }
    return { success: true, message: 'Subscribed to wexel notifications' };
  }

  /**
   * Subscribe to marketplace notifications
   */
  @SubscribeMessage('subscribe:marketplace')
  handleSubscribeMarketplace(@ConnectedSocket() client: Socket) {
    const clientData = this.clients.get(client.id);
    if (clientData) {
      clientData.subscriptions.add('marketplace:all');
      this.logger.log(`Client ${client.id} subscribed to marketplace`);
    }
    return {
      success: true,
      message: 'Subscribed to marketplace notifications',
    };
  }

  /**
   * Unsubscribe from notifications
   */
  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @MessageBody() data: { channel: string },
    @ConnectedSocket() client: Socket,
  ) {
    const clientData = this.clients.get(client.id);
    if (clientData) {
      clientData.subscriptions.delete(data.channel);
      this.logger.log(`Client ${client.id} unsubscribed from: ${data.channel}`);
    }
    return { success: true, message: 'Unsubscribed' };
  }

  /**
   * Emit notification to specific user
   */
  emitToUser(walletAddress: string, event: string, data: any) {
    const channel = `user:${walletAddress}`;
    this.clients.forEach((clientData, clientId) => {
      if (clientData.subscriptions.has(channel)) {
        this.server.to(clientId).emit(event, data);
        this.logger.debug(
          `Emitted ${event} to user ${walletAddress} (client: ${clientId})`,
        );
      }
    });
  }

  /**
   * Emit notification to specific wexel subscribers
   */
  emitToWexel(wexelId: number, event: string, data: any) {
    const channel = `wexel:${wexelId}`;
    this.clients.forEach((clientData, clientId) => {
      if (clientData.subscriptions.has(channel)) {
        this.server.to(clientId).emit(event, data);
        this.logger.debug(
          `Emitted ${event} to wexel ${wexelId} (client: ${clientId})`,
        );
      }
    });
  }

  /**
   * Emit notification to marketplace subscribers
   */
  emitToMarketplace(event: string, data: any) {
    const channel = 'marketplace:all';
    this.clients.forEach((clientData, clientId) => {
      if (clientData.subscriptions.has(channel)) {
        this.server.to(clientId).emit(event, data);
        this.logger.debug(
          `Emitted ${event} to marketplace (client: ${clientId})`,
        );
      }
    });
  }

  /**
   * Broadcast to all connected clients
   */
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.debug(`Broadcasted ${event} to all clients`);
  }

  /**
   * Get connection stats
   */
  getStats() {
    return {
      totalConnections: this.clients.size,
      connections: Array.from(this.clients.entries()).map(
        ([clientId, data]) => ({
          clientId,
          walletAddress: data.walletAddress,
          subscriptions: Array.from(data.subscriptions),
        }),
      ),
    };
  }
}
