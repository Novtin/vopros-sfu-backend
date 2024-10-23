import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '../entities/tag.entity';
import { SearchTagDto } from '../dtos/search-tag.dto';
import { SaveTagDto } from '../dtos/save-tag.dto';

@Injectable()
export class TagRepository {
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
