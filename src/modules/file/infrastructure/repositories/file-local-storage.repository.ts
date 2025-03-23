import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { IFileStorageRepository } from '../../domain/interfaces/i-file-storage-repository';
import { IConfigService } from '../../../global/domain/interfaces/i-config-service';
import { FileModel } from '../../domain/models/file.model';
import { NotFoundException } from '../../../global/domain/exceptions/not-found.exception';
import * as sharp from 'sharp';
import { StreamFileDto } from '../../domain/dtos/stream-file.dto';

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

  private readonly miniatureSizes: [number, number] =
    this.configService.get('fileLocal').miniatureSizes;

  delete(fileName: string): void {
    fs.unlink(join(...this.pathToStorage, fileName), () => {
      console.error('File not found');
    });
  }

  getReadStream(fileModel: FileModel, dto: StreamFileDto): any {
    const path: string = join(
      ...(dto.isExample ? this.pathToStorageExample : this.pathToStorage),
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
