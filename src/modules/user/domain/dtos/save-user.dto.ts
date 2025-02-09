import { RoleModel } from '../models/role.model';

export class SaveUserDto {
  email: string;

  nickname: string;

  passwordHash: string;

  description: string;

  roles: RoleModel[];
}
