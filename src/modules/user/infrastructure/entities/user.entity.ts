import { EntitySchema } from 'typeorm';
import { UserModel } from '../../domain/models/user.model';
import { AbstractTimeEntity } from '../../../global/infrastructure/entities/abstract-time.entity';

export const UserEntity = new EntitySchema<UserModel>({
  name: 'user',
  tableName: 'user',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    nickname: {
      type: 'varchar',
      unique: true,
    },
    passwordHash: {
      type: 'varchar',
    },
    description: {
      type: 'varchar',
      nullable: true,
    },
    isConfirmed: {
      type: 'boolean',
      default: false,
    },
    emailHash: {
      type: 'varchar',
    },
    avatarId: {
      type: 'int',
      nullable: true,
    },
    ...AbstractTimeEntity,
  },
  relations: {
    roles: {
      type: 'many-to-many',
      target: 'role',
      inverseSide: 'users',
      cascade: true,
      joinTable: {
        name: 'user_role',
        joinColumn: {
          name: 'userId',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'roleId',
          referencedColumnName: 'id',
        },
      },
    },
    avatar: {
      type: 'one-to-one',
      target: 'file',
      joinColumn: {
        name: 'avatarId',
      },
    },
    questions: {
      type: 'one-to-many',
      target: 'question',
      inverseSide: 'author',
    },
    answers: {
      type: 'one-to-many',
      target: 'answer',
      inverseSide: 'author',
    },
  },
});
