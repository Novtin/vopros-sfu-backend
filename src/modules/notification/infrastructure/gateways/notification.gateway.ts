import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Injectable } from '@nestjs/common';
import { NotificationModel } from '../../domain/models/notification.model';
import { NotificationService } from '../../domain/services/notification.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEnum } from '../../../global/domain/enums/event.enum';
import { IEventEmitterService } from '../../../global/domain/interfaces/i-event-emitter-service';

@Injectable()
@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;

  constructor(
    private readonly notificationService: NotificationService,
    @Inject(IEventEmitterService)
    private readonly eventEmitterService: IEventEmitterService,
  ) {}

  @OnEvent(EventEnum.SEND_NOTIFICATION)
  send(notification: NotificationModel): void {
    this.server
      .to(notification.userId.toString())
      .emit('new-answer', JSON.stringify(notification));
  }

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(userId);
      const [notifications] = await this.notificationService.search({
        userId: +userId,
        isViewed: false,
      });
      notifications?.forEach(this.send);
      this.eventEmitterService.emit(EventEnum.ONLINE_USER, +userId);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Array.from(client.rooms.keys()).find(
      (room) => room !== client.id,
    );
    if (userId) {
      this.eventEmitterService.emit(EventEnum.OFFLINE_USER, +userId);
    }
  }
}
