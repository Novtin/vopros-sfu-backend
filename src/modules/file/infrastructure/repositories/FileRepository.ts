import { Injectable } from '@nestjs/common';
import { FileSaveDto } from '../../domain/dtos/FileSaveDto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { FileSearchDto } from '../../domain/dtos/FileSearchDto';
import { FileExistDto } from '../../domain/dtos/FileExistDto';
import { IFileRepository } from '../../domain/interfaces/IFileRepository';
import { FileModel } from '../../domain/models/FileModel';
import { FileEntity } from '../entities/FileEntity';

@Injectable()
export class FileRepository implements IFileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private dbRepository: Repository<FileModel>,
  ) {}

  create(dto: FileSaveDto): Promise<FileModel> {
    return this.dbRepository.save(dto);
  }

  getOneBy(dto: FileSearchDto): Promise<FileModel> {
    return this.dbRepository.createQueryBuilder().where(dto).take(1).getOne();
  }

  async delete(id: number): Promise<void> {
    await this.dbRepository.delete({ id });
  }

  existBy(dto: FileExistDto): Promise<boolean> {
    return this.dbRepository.existsBy(dto);
  }

  getExamples(): Promise<FileModel[]> {
    return this.dbRepository.findBy({
      name: ILike('avatar%'),
    });
  }
}
