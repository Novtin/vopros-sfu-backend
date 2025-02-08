import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { IFileStorageRepository } from '../../domain/interfaces/i-file-storage-repository';
import { IConfigService } from '../../../global/domain/interfaces/i-config-service';
import { FileModel } from '../../domain/models/file.model';
import { NotFoundException } from '../../../global/domain/exceptions/not-found.exception';

@Injectable()
export class FileLocalStorageRepository implements IFileStorageRepository {
  constructor(
    @Inject(IConfigService)
    private readonly configService: IConfigService,
  ) {}

  private readonly pathToStorage: string[] = this.configService
    .get('fileLocal')
    .storagePath.split('/');

  private readonly pathToStorageExample: string[] = this.configService
    .get('fileLocal')
    .storageExamplePath.split('/');

  delete(fileName: string): void {
    fs.unlink(join(...this.pathToStorage, fileName), (error) => {
      throw new NotFoundException(error.message);
    });
  }

  getReadStream(fileModel: FileModel, isExample: boolean): any {
    const path: string = join(
      ...(isExample ? this.pathToStorageExample : this.pathToStorage),
      fileModel.name,
    );

    if (fs.existsSync(path)) {
      return fs.createReadStream(path);
    } else {
      throw new NotFoundException();
    }
  }
}
