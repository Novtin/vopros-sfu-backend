import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from './MigrationConfig';

export default registerAs('typeorm', (): TypeOrmModuleOptions => config);
