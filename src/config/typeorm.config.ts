import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from './orm.datasource';

export default registerAs('typeorm', (): TypeOrmModuleOptions => config);
