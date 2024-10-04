import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionEntity } from '../entities/question.entity';
import { SearchQuestionDto } from '../dtos/search-question.dto';
import { ExistQuestionDto } from '../dtos/exist-question.dto';
import { SaveQuestionDto } from '../dtos/save-question.dto';
import { UpdateQuestionDto } from '../dtos/update-question.dto';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly dbRepository: Repository<QuestionEntity>,
  ) {}

  create(dto: SaveQuestionDto): Promise<QuestionEntity> {
    return this.dbRepository.save({ ...dto });
  }

  getOneBy(dto: SearchQuestionDto): Promise<QuestionEntity> {
    return this.dbRepository.createQueryBuilder().where(dto).getOne();
  }

  existBy(dto: ExistQuestionDto): Promise<boolean> {
    return this.dbRepository.existsBy({ ...dto });
  }

  async update(id: number, dto: UpdateQuestionDto): Promise<QuestionEntity> {
    await this.dbRepository.update(id, dto);
    return this.getOneBy({ id });
  }

  async search(dto: SearchQuestionDto): Promise<QuestionEntity[]> {
    const query = this.dbRepository.createQueryBuilder('question');
    if (dto?.description) {
      query.where('question.title ILIKE :title', { title: `%${dto.title}%` });
    }

    if (dto?.description) {
      query.andWhere('question.description ILIKE :description', {
        description: `%${dto.description}%`,
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

  async delete(id: number) {
    await this.dbRepository.softDelete({ id });
  }
}
