import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { INotificationMessage } from '../../domain/interfaces/i-notification-message';
import { INotificationRepository } from '../../domain/interfaces/i-notification-repository';
import { INotificationService } from '../../domain/interfaces/i-notification-service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class NotificationService implements INotificationService {
  @WebSocketServer()
  private readonly server: Server;

  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async sendNotificationToUser(userId: string, message: INotificationMessage) {
    const isUserOnline = this.server.sockets.adapter.rooms.has(userId);

    if (isUserOnline) {
      this.server.to(userId).emit('new-answer', JSON.stringify(message));
    } else {
      await this.notificationRepository.add(userId, message);
    }
  }

  @SubscribeMessage('connect-user')
  async handleConnection(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string,
  ) {
    const messages: INotificationMessage[] =
      await this.notificationRepository.get(userId);
    if (messages.length > 0) {
      messages.forEach((message) =>
        this.sendNotificationToUser(userId, message),
      );

      await this.notificationRepository.delete(userId);
    }
    socket.join(userId);
  }
}
