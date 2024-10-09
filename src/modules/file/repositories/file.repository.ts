import { Injectable } from '@nestjs/common';
import { FileEntity } from '../entities/file.entity';
import { SaveFileDto } from '../dtos/save-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchFileDto } from '../dtos/search-file.dto';
import { ExistFileDto } from '../dtos/exist-file.dto';

@Injectable()
export class FileRepository {
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
