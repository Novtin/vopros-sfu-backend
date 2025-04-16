import { NotificationSaveDto } from '../dtos/NotificationSaveDto';
import { NotificationModel } from '../models/NotificationModel';
import { NotificationSearchDto } from '../dtos/NotificationSearchDto';
import { NotificationViewDto } from '../dtos/NotificationViewDto';

export const INotificationRepository = 'INotificationRepository';

export interface INotificationRepository {
  create(dto: NotificationSaveDto): Promise<NotificationModel>;
  search(dto: NotificationSearchDto): Promise<[NotificationModel[], number]>;
  view(dto: NotificationViewDto): Promise<void>;
  deleteOld(): Promise<void>;
}
