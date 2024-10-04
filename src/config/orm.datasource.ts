import { DataSource } from 'typeorm';
import * as process from 'process';
import * as dotenv from 'dotenv';
import { UserEntity } from '../modules/user/entities/user.entity';
import { RoleEntity } from '../modules/user/entities/role.entity';
import { QuestionEntity } from '../modules/question/entities/question.entity';

dotenv.config({ path: '.env' });
export default new DataSource({
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
});
