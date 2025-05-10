import { UserModel } from '../../../user/domain/models/UserModel';

export class NotificationModel {
  id: number;
  userId: number;
  payload: Record<string, any>;
  user: UserModel;
  createdAt: Date;
  isViewed: boolean;
}
