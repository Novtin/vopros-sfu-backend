import { UserModel } from '../../../user/domain/models/UserModel';

export class NotificationModel {
  id: number;
  userId: number;
  payload: { [key: string]: any };
  user: UserModel;
  createdAt: Date;
  isViewed: boolean;
}
