import { Inject, Injectable } from '@nestjs/common';
import { SaveFileDto } from '../dtos/save-file.dto';
import { SearchFileDto } from '../dtos/search-file.dto';
import { ExistQuestionDto } from '../../../question/domain/dtos/exist-question.dto';
import { ExistFileDto } from '../dtos/exist-file.dto';
import { IFileRepository } from '../interfaces/i-file-repository';
import { FileModel } from '../models/file.model';
import { NotFoundException } from '../../../global/domain/exceptions/not-found.exception';
import { IFileLocalRepository } from '../interfaces/i-file-local-repository';
import { IFile } from '../interfaces/i-file';
import { StreamFileDto } from '../dtos/stream-file.dto';

@Injectable()
export class FileService {
  constructor(
    @Inject(IFileRepository)
    private readonly fileRepository: IFileRepository,
    @Inject(IFileLocalRepository)
    private readonly fileLocalRepository: IFileLocalRepository,
  ) {}

  create(file: IFile): Promise<FileModel> {
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

  async getReadStreamByFileId(id: number, dto: StreamFileDto) {
    const fileModel: FileModel = await this.getOneBy({ id });
    return this.fileLocalRepository.getReadStream(fileModel, dto.isExample);
  }

  async delete(id: number): Promise<void> {
    const fileModel = await this.getOneBy({ id });
    if (!fileModel.name.startsWith('avatar')) {
      this.fileLocalRepository.delete(fileModel.name);
      await this.fileRepository.delete(id);
    }
  }

  async throwNotFoundExceptionIfNotExist(dto: ExistQuestionDto) {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException();
    }
  }

  existBy(dto: ExistFileDto): Promise<boolean> {
    return this.fileRepository.existBy(dto);
  }

  async getExampleIds() {
    const models = await this.fileRepository.getExamples();
    return {
      fileIds: models.map((model) => model.id),
    };
  }
}
