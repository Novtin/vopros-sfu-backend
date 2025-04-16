import { RoleModel } from '../models/RoleModel';

export class UserSaveDto {
  email: string;

  nickname: string;

  passwordHash: string;

  description?: string;

  roles: RoleModel[];
}
