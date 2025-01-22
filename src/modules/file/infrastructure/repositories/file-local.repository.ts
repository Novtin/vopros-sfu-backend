import { Inject, Injectable } from '@nestjs/common';
import fs from 'fs';
import { join } from 'path';
import { IFileLocalRepository } from '../../domain/interfaces/i-file-local-repository';
import { IConfigService } from '../../../global/domain/interfaces/i-config-service';

@Injectable()
export class FileLocalRepository implements IFileLocalRepository {
  constructor(
    @Inject(IConfigService)
    private readonly configService: IConfigService,
  ) {}

  private readonly pathToStorage =
    this.configService.get('fileLocal').storagePath;

  delete(fileName: string): void {
    fs.unlink(join(this.pathToStorage, fileName), (error) => {
      console.error(error);
    });
  }
}
