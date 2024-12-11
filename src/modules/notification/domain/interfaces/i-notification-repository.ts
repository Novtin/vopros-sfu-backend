import { INotificationMessage } from './i-notification-message';

export const INotificationRepository = 'INotificationRepository';

export interface INotificationRepository {
  add(userId: string, message: INotificationMessage): Promise<void>;
  delete(userId: string): Promise<void>;
  get(userId: string): Promise<INotificationMessage[]>;
}
