import { Injectable } from '@nestjs/common';
import { FileEntity } from '../../domain/entities/file.entity';
import { SaveFileDto } from '../../domain/dtos/save-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchFileDto } from '../../domain/dtos/search-file.dto';
import { ExistFileDto } from '../../domain/dtos/exist-file.dto';
import { IFileRepository } from '../../domain/interfaces/i-file-repository';

@Injectable()
export class FileRepository implements IFileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private dbRepository: Repository<FileEntity>,
  ) {}

  create(dto: SaveFileDto): Promise<FileEntity> {
    return this.dbRepository.save(dto);
  }

  getOneBy(dto: SearchFileDto): Promise<FileEntity> {
    return this.dbRepository.createQueryBuilder().where(dto).limit(1).getOne();
  }

  async delete(id: number): Promise<void> {
    await this.dbRepository.softDelete({ id });
  }

  existBy(dto: ExistFileDto): Promise<boolean> {
    return this.dbRepository.existsBy(dto);
  }
}
