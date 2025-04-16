import { UserModel } from '../../../user/domain/models/UserModel';

export class AuthLoginModel {
  id: string;

  userId: number;

  user: UserModel;

  accessToken: string;

  refreshToken: string;

  isLogout: boolean;

  ipAddress: string;

  createdAt: Date;

  updatedAt: Date;
}
