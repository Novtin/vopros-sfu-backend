import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'typeorm',
  (): TypeOrmModuleOptions => ({
    type: <any>process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    entities: [process.env.DB_ENTITIES],
    migrations: [process.env.DB_MIGRATIONS],
    migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
    migrationsTableName: process.env.DB_MIGRATIONS_TABLE_NAME,
  }),
);
