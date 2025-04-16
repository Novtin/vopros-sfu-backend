import { Inject, Injectable } from '@nestjs/common';
import { FileSaveDto } from '../dtos/FileSaveDto';
import { FileSearchDto } from '../dtos/FileSearchDto';
import { FileExistDto } from '../dtos/FileExistDto';
import { IFileRepository } from '../interfaces/IFileRepository';
import { FileModel } from '../models/FileModel';
import { NotFoundException } from '../../../global/domain/exceptions/NotFoundException';
import { IFileStorageRepository } from '../interfaces/IFileStorageRepository';
import { IFile } from '../interfaces/IFile';
import { FileStreamDto } from '../dtos/FileStreamDto';

@Injectable()
export class FileService {
  constructor(
    @Inject(IFileRepository)
    private readonly fileRepository: IFileRepository,
    @Inject(IFileStorageRepository)
    private readonly fileStorageRepository: IFileStorageRepository,
  ) {}

  create(file: IFile): Promise<FileModel> {
    const dto: FileSaveDto = {
      name: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
    return this.fileRepository.create(dto);
  }

  async getOneBy(dto: FileSearchDto): Promise<FileModel> {
    await this.throwNotFoundExceptionIfNotExist(dto);
    return this.fileRepository.getOneBy(dto);
  }

  async getReadStreamByFileId(id: number, dto: FileStreamDto) {
    const fileModel: FileModel = await this.getOneBy({ id });
    return this.fileStorageRepository.getReadStream(fileModel, dto);
  }

  async delete(id: number): Promise<void> {
    const fileModel = await this.getOneBy({ id });
    if (!fileModel.name.startsWith('avatar')) {
      this.fileStorageRepository.delete(fileModel.name);
      await this.fileRepository.delete(id);
    }
  }

  async throwNotFoundExceptionIfNotExist(dto: FileSearchDto) {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException();
    }
  }

  existBy(dto: FileExistDto): Promise<boolean> {
    return this.fileRepository.existBy(dto);
  }

  async getExampleIds() {
    const models = await this.fileRepository.getExamples();
    return {
      fileIds: models.map((model) => model.id),
    };
  }
}
