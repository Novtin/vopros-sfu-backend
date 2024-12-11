import { INotificationMessage } from './i-notification-message';

export const INotificationService = 'INotificationService';

export interface INotificationService {
  sendNotificationToUser(
    userId: string,
    message: INotificationMessage,
  ): Promise<void>;
}
