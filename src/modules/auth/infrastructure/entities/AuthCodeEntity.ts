import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { AuthCodeModel } from '../../domain/models/AuthCodeModel';
import { AuthCodeTypeEnum } from '../../domain/enums/AuthCodeTypeEnum';
import * as process from 'process';

export const AuthCodeEntity = new EntitySchema<AuthCodeModel>({
  name: 'auth_code',
  tableName: 'auth_code',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    code: {
      type: 'varchar',
      nullable: false,
    },
    type: {
      type: 'enum',
      enum: AuthCodeTypeEnum,
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
    isActiveAt: {
      type: 'timestamp with time zone',
      nullable: false,
      default: () => `NOW() + INTERVAL '1 hour'`,
    },
    availableAttempts: {
      type: 'int',
      nullable: false,
      default: +process.env.AUTH_CODE_ATTEMPTS,
    },
    userId: {
      type: 'int',
      nullable: true,
    },
    isUsed: {
      type: 'boolean',
      default: false,
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
