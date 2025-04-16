import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from './TypeormDatasource';

export default registerAs('typeorm', (): TypeOrmModuleOptions => config);
