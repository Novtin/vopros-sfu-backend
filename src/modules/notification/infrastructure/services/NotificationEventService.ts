import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../domain/services/NotificationService';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEnum } from '../../../global/domain/enums/EventEnum';
import { NotificationSaveDto } from '../../domain/dtos/NotificationSaveDto';
import { NotificationViewDto } from '../../domain/dtos/NotificationViewDto';

@Injectable()
export class NotificationEventService {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent(EventEnum.CREATE_NOTIFICATION)
  async onSendNotification(dto: NotificationSaveDto) {
    await this.notificationService.createAndSend(dto);
  }

  @OnEvent(EventEnum.VIEW_NOTIFICATION)
  async onViewNotification(dto: NotificationViewDto) {
    await this.notificationService.view(dto);
  }
}
