import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('fileLocal', () => ({
  storagePath: process.env.FILE_SAVE_PATH,
}));
