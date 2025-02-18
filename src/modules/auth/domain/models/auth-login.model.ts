import { UserModel } from '../../../user/domain/models/user.model';

export class AuthLoginModel {
  id: number;

  userId: number;

  user: UserModel;

  accessToken: string;

  refreshToken: string;

  isLogout: boolean;

  ipAddress: string;

  createdAt: Date;

  updatedAt: Date;
}
