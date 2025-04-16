import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../domain/services/NotificationService';

@Injectable()
export class NotificationCronService {
  constructor(private readonly notificationService: NotificationService) {}

  @Cron('0 0 */5 * *')
  private async deleteOld() {
    await this.notificationService.deleteOld();
  }
}
