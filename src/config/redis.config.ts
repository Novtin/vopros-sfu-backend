import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('redis', () => ({
  port: +process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
}));
