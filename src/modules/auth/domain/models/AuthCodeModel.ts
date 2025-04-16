import { UserModel } from '../../../user/domain/models/UserModel';
import { AuthCodeTypeEnum } from '../enums/AuthCodeTypeEnum';

export class AuthCodeModel {
  id: number;

  userId: number;

  user: UserModel;

  code: string;

  type: AuthCodeTypeEnum;

  createdAt: Date;

  updatedAt: Date;

  isActiveAt: Date;

  isUsed: boolean;

  availableAttempts: number;
}
