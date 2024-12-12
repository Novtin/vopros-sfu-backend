import { SaveNotificationDto } from '../dtos/save-notification.dto';
import { NotificationModel } from '../models/notification.model';
import { SearchNotificationDto } from '../dtos/search-notification.dto';
import { ViewNotificationDto } from '../dtos/view-notification.dto';

export const INotificationRepository = 'INotificationRepository';

export interface INotificationRepository {
  create(dto: SaveNotificationDto): Promise<NotificationModel>;
  search(dto: SearchNotificationDto): Promise<[NotificationModel[], number]>;
  view(dto: ViewNotificationDto): Promise<void>;
  deleteOld(): Promise<void>;
}
