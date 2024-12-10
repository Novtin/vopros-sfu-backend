import { EntitySchema } from 'typeorm';
import { RoleModel } from '../../domain/models/role.model';

export const RoleEntity = new EntitySchema<RoleModel>({
  name: 'role',
  tableName: 'role',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
    },
  },
  relations: {
    users: {
      type: 'many-to-many',
      target: 'user',
      inverseSide: 'roles',
    },
  },
});
