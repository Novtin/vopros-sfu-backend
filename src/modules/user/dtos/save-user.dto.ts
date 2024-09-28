import { RoleEntity } from '../entities/role.entity';

export class SaveUserDto {
  email: string;

  passwordHash: string;

  description: string;

  roles: RoleEntity[];
}
