import { RoleEntity } from '../entities/role.entity';

export class SaveUserDto {
  email: string;

  nickname: string;

  passwordHash: string;

  description: string;

  roles: RoleEntity[];

  emailHash: string;
}
