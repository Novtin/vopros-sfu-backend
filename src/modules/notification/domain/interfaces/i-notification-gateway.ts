import { NotificationModel } from '../models/notification.model';

export const INotificationGateway = 'INotificationGateway';

export interface INotificationGateway {
  send(notification: NotificationModel): void;
}
