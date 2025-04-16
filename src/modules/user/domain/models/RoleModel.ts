import { UserModel } from './UserModel';

export class RoleModel {
  id: number;

  name: string;

  users: UserModel[];
}
