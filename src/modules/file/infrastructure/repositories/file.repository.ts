import { Injectable } from '@nestjs/common';
import { SaveFileDto } from '../../domain/dtos/save-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { SearchFileDto } from '../../domain/dtos/search-file.dto';
import { ExistFileDto } from '../../domain/dtos/exist-file.dto';
import { IFileRepository } from '../../domain/interfaces/i-file-repository';
import { FileModel } from '../../domain/models/file.model';
import { FileEntity } from '../entities/file.entity';

@Injectable()
export class FileRepository implements IFileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private dbRepository: Repository<FileModel>,
  ) {}

  create(dto: SaveFileDto): Promise<FileModel> {
    return this.dbRepository.save(dto);
  }

  getOneBy(dto: SearchFileDto): Promise<FileModel> {
    return this.dbRepository.createQueryBuilder().where(dto).take(1).getOne();
  }

  async delete(id: number): Promise<void> {
    await this.dbRepository.softDelete({ id });
  }

  existBy(dto: ExistFileDto): Promise<boolean> {
    return this.dbRepository.existsBy(dto);
  }

  getExamples(): Promise<FileModel[]> {
    return this.dbRepository.findBy({
      name: ILike('avatar%'),
    });
  }
}
