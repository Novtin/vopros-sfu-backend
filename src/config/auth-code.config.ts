import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('authCode', () => ({
  attempts: process.env.AUTH_CODE_ATTEMPTS,
  activeInterval: process.env.AUTH_CODE_ACTIVE_INTERVAL,
  length: process.env.AUTH_CODE_LENGTH,
}));
