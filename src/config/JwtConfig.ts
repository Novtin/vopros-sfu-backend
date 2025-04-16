import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('jwt', () => ({
  algorithm: process.env.JWT_ALG,
  accessSecret: process.env.JWT_ACCESS_SECRET,
  accessExp: process.env.JWT_ACCESS_EXP,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExp: process.env.JWT_REFRESH_EXP,
}));
