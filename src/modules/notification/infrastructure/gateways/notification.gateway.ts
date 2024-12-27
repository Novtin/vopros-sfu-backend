import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotificationModel } from '../../domain/models/notification.model';
import { NotificationService } from '../../domain/services/notification.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEnum } from '../../../global/domain/enums/event.enum';

@Injectable()
@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  private readonly server: Server;

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent(EventEnum.SEND_NOTIFICATION)
  send(notification: NotificationModel): void {
    this.server
      .to(notification.userId.toString())
      .emit('new-answer', JSON.stringify(notification));
  }

  @SubscribeMessage('connect-user')
  async handleConnection(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string,
  ) {
    socket.join(userId);
    const [notifications] = await this.notificationService.search({
      userId: +userId,
      isViewed: false,
    });
    notifications?.forEach(this.send);
  }
}
