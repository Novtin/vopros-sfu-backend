import { Inject, Injectable } from '@nestjs/common';
import { SaveFileDto } from '../dtos/save-file.dto';
import { SearchFileDto } from '../dtos/search-file.dto';
import { ExistQuestionDto } from '../../../question/domain/dtos/exist-question.dto';
import { ExistFileDto } from '../dtos/exist-file.dto';
import { join } from 'path';
import * as process from 'process';
import * as fs from 'fs';
import { IFileRepository } from '../interfaces/i-file-repository';
import { FileModel } from '../models/file.model';
import { NotFoundException } from '../../../global/domain/exceptions/not-found.exception';

@Injectable()
export class FileService {
  constructor(
    @Inject(IFileRepository)
    private readonly fileRepository: IFileRepository,
  ) {}

  create(file: Express.Multer.File): Promise<FileModel> {
    const dto: SaveFileDto = {
      name: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
    return this.fileRepository.create(dto);
  }

  async getOneBy(dto: SearchFileDto): Promise<FileModel> {
    await this.throwNotFoundExceptionIfNotExist(dto);
    return this.fileRepository.getOneBy(dto);
  }

  async getReadStreamByFileId(id: number) {
    const fileModel: FileModel = await this.getOneBy({ id });
    const path: string = join(
      ...process.env.FILE_SAVE_PATH.split('/'),
      fileModel.name,
    );
    if (fs.existsSync(path)) {
      return fs.createReadStream(path);
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: number): Promise<void> {
    const fileModel = await this.getOneBy({ id });
    fs.unlink(join('src/files', fileModel.name), (error) => {
      console.error(error);
    });
    await this.fileRepository.delete(id);
  }

  async throwNotFoundExceptionIfNotExist(dto: ExistQuestionDto) {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException();
    }
  }

  existBy(dto: ExistFileDto): Promise<boolean> {
    return this.fileRepository.existBy(dto);
  }
}
