import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { CacheService } from '../service/cache.service';

@WebSocketGateway({
  cors: true,
  namespace: '/realtime',
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const user = await this.authService.validateToken(token);

      client.data.user = user;
      client.data.tenantId = user.tenantId;

      // Join tenant room
      await client.join(`tenant_${user.tenantId}`);

      // Store connection
      await this.cacheService.setUserSession(user.id, user.tenantId, {
        socketId: client.id,
        connectedAt: new Date(),
      });
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.data.user) {
      await this.cacheService.removeUserSession(
        client.data.user.id,
        client.data.tenantId,
      );
    }
  }

  @SubscribeMessage('join_class_room')
  async handleJoinClassRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { classScheduleId: string },
  ) {
    await client.join(`class_${data.classScheduleId}`);
  }

  emitToTenant(tenantId: string, event: string, data: any) {
    this.server.to(`tenant_${tenantId}`).emit(event, data);
  }

  emitToClass(classScheduleId: string, event: string, data: any) {
    this.server.to(`class_${classScheduleId}`).emit(event, data);
  }
}
