import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { IFileStorageRepository } from '../../domain/interfaces/IFileStorageRepository';
import { IConfigService } from '../../../global/domain/interfaces/IConfigService';
import { FileModel } from '../../domain/models/FileModel';
import { NotFoundException } from '../../../global/domain/exceptions/NotFoundException';
import * as sharp from 'sharp';
import { FileStreamDto } from '../../domain/dtos/FileStreamDto';

@Injectable()
export class FileLocalStorageRepository implements IFileStorageRepository {
  constructor(
    @Inject(IConfigService)
    private readonly configService: IConfigService,
  ) {}

  private readonly pathToStorage: string = this.configService.get(
    'fileLocal.storagePath',
  );

  private readonly pathToStorageExample: string = this.configService.get(
    'fileLocal.storageExamplePath',
  );

  private readonly miniatureSizes: [number, number] = this.configService.get<
    [number, number]
  >('fileLocal.miniatureSizes');

  delete(fileName: string): void {
    fs.unlink(join(this.pathToStorage, fileName), (err) => {
      if (err) {
        console.error('File not found');
      }
    });
  }

  getReadStream(fileModel: FileModel, dto: FileStreamDto): any {
    const path: string = join(
      dto.isExample ? this.pathToStorageExample : this.pathToStorage,
      fileModel.name,
    );

    if (fs.existsSync(path)) {
      const fileStream = fs.createReadStream(path);
      if (dto.isMiniature && fileModel.mimetype.startsWith('image/')) {
        const resizedStream = sharp().resize(
          this.miniatureSizes[0],
          this.miniatureSizes[1],
          { fit: 'cover' },
        );
        return fileStream.pipe(resizedStream);
      }
      return fileStream;
    } else {
      throw new NotFoundException();
    }
  }
}
