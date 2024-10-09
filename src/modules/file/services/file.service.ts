import { Injectable, NotFoundException } from '@nestjs/common';
import { FileRepository } from '../repositories/file.repository';
import { SaveFileDto } from '../dtos/save-file.dto';
import { FileEntity } from '../entities/file.entity';
import { SearchFileDto } from '../dtos/search-file.dto';
import { ExistQuestionDto } from '../../question/dtos/exist-question.dto';
import { ExistFileDto } from '../dtos/exist-file.dto';

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  create(file: Express.Multer.File): Promise<FileEntity> {
    const dto: SaveFileDto = {
      name: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
    return this.fileRepository.create(dto);
  }

  async getOneBy(dto: SearchFileDto): Promise<FileEntity> {
    await this.throwNotFoundExceptionIfNotExist(dto);
    return this.fileRepository.getOneBy(dto);
  }

  async delete(id: number): Promise<void> {
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
