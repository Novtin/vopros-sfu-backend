import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RoleEntity } from '../modules/user/entities/role.entity';
import { UserEntity } from '../modules/user/entities/user.entity';
import { QuestionEntity } from '../modules/question/entities/question.entity';

export default registerAs(
  'typeorm',
  (): TypeOrmModuleOptions => ({
    type: <any>process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: process.env.DB_LOGGING === 'true',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    entities: [RoleEntity, UserEntity, QuestionEntity],
    migrations: [process.env.DB_MIGRATIONS],
    migrationsTableName: process.env.DB_MIGRATIONS_TABLE_NAME,
  }),
);
