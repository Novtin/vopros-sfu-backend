import { Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../domain/interfaces/i-notification-repository';
import { SaveNotificationDto } from '../../domain/dtos/save-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { Repository } from 'typeorm';
import { NotificationModel } from '../../domain/models/notification.model';
import { SearchNotificationDto } from '../../domain/dtos/search-notification.dto';
import { ViewNotificationDto } from '../../domain/dtos/view-notification.dto';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly dbRepository: Repository<NotificationModel>,
  ) {}

  create(dto: SaveNotificationDto): Promise<NotificationModel> {
    return this.dbRepository.save(dto);
  }

  async view(dto: ViewNotificationDto): Promise<void> {
    await this.dbRepository
      .createQueryBuilder()
      .update('notification')
      .set({
        isViewed: true,
      })
      .where('userId = :userId', { userId: dto.userId })
      .andWhere('payload @> :payload', {
        payload: JSON.stringify(dto.payload),
      })
      .execute();
  }

  search(dto: SearchNotificationDto): Promise<[NotificationModel[], number]> {
    const query = this.dbRepository
      .createQueryBuilder()
      .orderBy('"createdAt"', 'DESC')
      .limit(dto.pageSize)
      .offset(dto.page * dto.pageSize);
    if (dto.id) {
      query.andWhere({ id: dto.id });
    }
    if (dto.userId) {
      query.andWhere({ userId: dto.userId });
    }
    if (dto.isViewed) {
      query.andWhere({ isViewed: dto.isViewed });
    }
    return query.getManyAndCount();
  }

  async deleteOld(): Promise<void> {
    const dateThresholdForViewed = new Date();
    dateThresholdForViewed.setDate(dateThresholdForViewed.getDate() - 5);

    const dateThresholdForNotViewed = new Date();
    dateThresholdForNotViewed.setDate(dateThresholdForNotViewed.getDate() - 25);

    await this.dbRepository
      .createQueryBuilder()
      .delete()
      .from('notification')
      .where('createdAt < :dateThresholdForViewed AND isViewed = TRUE', {
        dateThresholdForViewed,
      })
      .orWhere('createdAt < :dateThresholdForNotViewed', {
        dateThresholdForNotViewed,
      })
      .execute();
  }
}
