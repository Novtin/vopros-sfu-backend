import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagModel } from '../../domain/models/TagModel';
import { TagSearchDto } from '../../domain/dtos/TagSearchDto';
import { TagSaveDto } from '../../domain/dtos/TagSaveDto';
import { ITagRepository } from '../../domain/interfaces/ITagRepository';
import { TagEntity } from '../entities/TagEntity';
import { TagSortEnum } from '../../domain/enums/TagSortEnum';

@Injectable()
export class TagRepository implements ITagRepository {
  constructor(
    @InjectRepository(TagEntity)
    private readonly dbRepository: Repository<TagModel>,
  ) {}

  async search(dto: TagSearchDto): Promise<[TagModel[], number]> {
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
      case TagSortEnum.CREATED_AT: {
        query.orderBy('tag.createdAt', 'DESC');
        break;
      }
      case TagSortEnum.NAME: {
        query.orderBy('tag.name', 'ASC');
        break;
      }
      case TagSortEnum.POPULAR: {
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

  create(dto: TagSaveDto): Promise<TagModel> {
    return this.dbRepository.save({ ...dto });
  }

  getOneBy(dto: TagSearchDto): Promise<TagModel> {
    return this.dbRepository.createQueryBuilder().where(dto).take(1).getOne();
  }
}
