import { UserModel } from './user.model';

export class RoleModel {
  id: number;

  name: string;

  users: UserModel[];
}
