import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '../../domain/entities/tag.entity';
import { SearchTagDto } from '../../domain/dtos/search-tag.dto';
import { SaveTagDto } from '../../domain/dtos/save-tag.dto';
import { ITagRepository } from '../../domain/interfaces/i-tag-repository';

@Injectable()
export class TagRepository implements ITagRepository {
  constructor(
    @InjectRepository(TagEntity)
    private readonly dbRepository: Repository<TagEntity>,
  ) {}

  async search(dto: SearchTagDto): Promise<TagEntity[]> {
    const query = this.dbRepository.createQueryBuilder('tag');
    if (dto?.name) {
      query.andWhere('tag.name ILIKE :name', {
        name: `%${dto.name}%`,
      });
    }

    if (dto?.pageSize) {
      query.limit(dto.pageSize);
      if (dto?.page) {
        query.offset(dto.pageSize * dto.page);
      }
    }
    return query.getMany();
  }

  create(dto: SaveTagDto): Promise<TagEntity> {
    return this.dbRepository.save({ ...dto });
  }

  getOneBy(dto: SearchTagDto): Promise<TagEntity> {
    return this.dbRepository.createQueryBuilder().where(dto).limit(1).getOne();
  }
}
