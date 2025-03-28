import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagModel } from '../../domain/models/tag.model';
import { SearchTagDto } from '../../domain/dtos/search-tag.dto';
import { SaveTagDto } from '../../domain/dtos/save-tag.dto';
import { ITagRepository } from '../../domain/interfaces/i-tag-repository';
import { TagEntity } from '../entities/tag.entity';
import { SortTagEnum } from '../../domain/enums/sort-tag.enum';

@Injectable()
export class TagRepository implements ITagRepository {
  constructor(
    @InjectRepository(TagEntity)
    private readonly dbRepository: Repository<TagModel>,
  ) {}

  async search(dto: SearchTagDto): Promise<[TagModel[], number]> {
    const query = this.dbRepository
      .createQueryBuilder('tag')
      .select([
        'tag.id',
        'tag.name',
        '(SELECT COUNT(*) FROM question_tag qt WHERE qt."tagId" = tag.id) AS "questionCount"',
      ]);
    if (dto.id) {
      query.andWhere({ id: dto.id });
    }
    if (dto.name) {
      query.andWhere('tag.name ILIKE :name', {
        name: `%${dto.name}%`,
      });
    }
    switch (dto.sort) {
      case SortTagEnum.CREATED_AT: {
        query.orderBy('tag.createdAt', 'DESC');
        break;
      }
      case SortTagEnum.NAME: {
        query.orderBy('tag.name', 'ASC');
        break;
      }
      case SortTagEnum.POPULAR: {
        query.orderBy('"questionCount"', 'DESC');
        break;
      }
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
