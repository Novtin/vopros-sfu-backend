import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../domain/services/notification.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEnum } from '../../../global/domain/enums/event.enum';
import { SaveNotificationDto } from '../../domain/dtos/save-notification.dto';
import { ViewNotificationDto } from '../../domain/dtos/view-notification.dto';

@Injectable()
export class NotificationEventService {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent(EventEnum.CREATE_NOTIFICATION)
  async onSendNotification(dto: SaveNotificationDto) {
    await this.notificationService.createAndSend(dto);
  }

  @OnEvent(EventEnum.VIEW_NOTIFICATION)
  async onViewNotification(dto: ViewNotificationDto) {
    await this.notificationService.view(dto);
  }
}
