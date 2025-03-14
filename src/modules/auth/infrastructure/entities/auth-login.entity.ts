import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { AuthLoginModel } from '../../domain/models/auth-login.model';

export const AuthLoginEntity = new EntitySchema<AuthLoginModel>({
  name: 'auth_login',
  tableName: 'auth_login',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    accessToken: {
      type: 'varchar',
      nullable: false,
    },
    refreshToken: {
      type: 'varchar',
      nullable: false,
    },
    createdAt: {
      type: 'timestamp with time zone',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp with time zone',
      updateDate: true,
    } as EntitySchemaColumnOptions,
    isLogout: {
      type: 'boolean',
      nullable: false,
      default: false,
    },
    userId: {
      type: 'int',
      nullable: true,
    },
    ipAddress: {
      type: 'varchar',
      nullable: false,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'user',
    },
  },
});
