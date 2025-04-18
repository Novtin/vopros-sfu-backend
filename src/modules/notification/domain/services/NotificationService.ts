import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../interfaces/INotificationRepository';
import { NotificationSaveDto } from '../dtos/NotificationSaveDto';
import { NotificationModel } from '../models/NotificationModel';
import { NotificationSearchDto } from '../dtos/NotificationSearchDto';
import { NotificationViewDto } from '../dtos/NotificationViewDto';
import { IEventEmitterService } from '../../../global/domain/interfaces/IEventEmitterService';
import { EventEnum } from '../../../global/domain/enums/EventEnum';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
    @Inject(IEventEmitterService)
    private readonly eventEmitterService: IEventEmitterService,
  ) {}

  private create(dto: NotificationSaveDto): Promise<NotificationModel> {
    return this.notificationRepository.create(dto);
  }

  search(dto: NotificationSearchDto): Promise<[NotificationModel[], number]> {
    return this.notificationRepository.search(dto);
  }

  async view(dto: NotificationViewDto): Promise<void> {
    await this.notificationRepository.view(dto);
  }

  async createAndSend(dto: NotificationSaveDto): Promise<NotificationModel> {
    const notification = await this.create(dto);
    this.eventEmitterService.emit(EventEnum.SEND_NOTIFICATION, notification);
    return notification;
  }

  async deleteOld() {
    await this.notificationRepository.deleteOld();
  }
}
