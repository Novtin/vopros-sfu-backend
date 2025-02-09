import { UserModel } from '../../../user/domain/models/user.model';
import { AuthCodeTypeEnum } from '../enums/auth-code-type.enum';

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
