import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagModel } from '../../domain/models/tag.model';
import { SearchTagDto } from '../../domain/dtos/search-tag.dto';
import { SaveTagDto } from '../../domain/dtos/save-tag.dto';
import { ITagRepository } from '../../domain/interfaces/i-tag-repository';
import { TagEntity } from '../entities/tag.entity';

@Injectable()
export class TagRepository implements ITagRepository {
  constructor(
    @InjectRepository(TagEntity)
    private readonly dbRepository: Repository<TagModel>,
  ) {}

  async search(dto: SearchTagDto): Promise<[TagModel[], number]> {
    const query = this.dbRepository.createQueryBuilder('tag');
    if (dto?.id) {
      query.andWhere({ id: dto.id });
    }
    if (dto?.name) {
      query.andWhere('tag.name ILIKE :name', {
        name: `%${dto.name}%`,
      });
    }

    if (dto?.pageSize) {
      query.take(dto.pageSize);
      if (dto?.page) {
        query.skip(dto.pageSize * dto.page);
      }
    }
    return query.getManyAndCount();
  }

  create(dto: SaveTagDto): Promise<TagModel> {
    return this.dbRepository.save({ ...dto });
  }

  getOneBy(dto: SearchTagDto): Promise<TagModel> {
    return this.dbRepository.createQueryBuilder().where(dto).take(1).getOne();
  }
}
