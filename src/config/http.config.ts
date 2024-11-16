import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('http', () => ({
  port: process.env.APP_PORT,
  host: process.env.APP_HOST,
  frontendUrl: process.env.FRONTEND_URL,
}));
