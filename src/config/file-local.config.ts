import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('fileLocal', () => ({
  storagePath: process.env.FILE_SAVE_PATH,
  storageExamplePath: process.env.FILE_EXAMPLES_SAVE_PATH,
  maxSize: process.env.FILE_MAX_SIZE,
}));
