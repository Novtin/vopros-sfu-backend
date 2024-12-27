import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../interfaces/i-notification-repository';
import { SaveNotificationDto } from '../dtos/save-notification.dto';
import { NotificationModel } from '../models/notification.model';
import { SearchNotificationDto } from '../dtos/search-notification.dto';
import { ViewNotificationDto } from '../dtos/view-notification.dto';
import { IEventEmitterService } from '../../../global/domain/interfaces/i-event-emitter-service';
import { EventEnum } from '../../../global/domain/enums/event.enum';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
    @Inject(IEventEmitterService)
    private readonly eventEmitterService: IEventEmitterService,
  ) {}

  private create(dto: SaveNotificationDto): Promise<NotificationModel> {
    return this.notificationRepository.create(dto);
  }

  search(dto: SearchNotificationDto): Promise<[NotificationModel[], number]> {
    return this.notificationRepository.search(dto);
  }

  async view(dto: ViewNotificationDto): Promise<void> {
    await this.notificationRepository.view(dto);
  }

  async createAndSend(dto: SaveNotificationDto): Promise<void> {
    const notification = await this.create(dto);
    this.eventEmitterService.emit(EventEnum.SEND_NOTIFICATION, notification);
  }

  async deleteOld() {
    await this.notificationRepository.deleteOld();
  }
}
