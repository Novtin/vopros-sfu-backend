import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionEntity } from '../entities/question.entity';
import { SearchQuestionDto } from '../dtos/search-question.dto';
import { ExistQuestionDto } from '../dtos/exist-question.dto';
import { UpdateQuestionDto } from '../dtos/update-question.dto';
import { RelationQuestionDto } from '../../file/dtos/relation-question.dto';
import { CreateQuestionDto } from '../dtos/create-question.dto';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly dbRepository: Repository<QuestionEntity>,
  ) {}

  async create(dto: CreateQuestionDto): Promise<QuestionEntity> {
    const model = await this.dbRepository.save({ ...dto });
    return this.getOneBy({ id: model.id });
  }

  async getOneBy(dto: Partial<QuestionEntity>): Promise<QuestionEntity> {
    return this.dbRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tags', 'tags')
      .leftJoinAndSelect('question.author', 'author')
      .leftJoinAndSelect('question.images', 'images')
      .leftJoinAndSelect('question.answers', 'answers')
      .leftJoinAndSelect('question.views', 'views')
      .leftJoinAndSelect('question.rate', 'rate')
      .leftJoinAndSelect('answers.author', 'answer_author')
      .where(dto)
      .limit(1)
      .getOne();
  }

  existBy(dto: ExistQuestionDto): Promise<boolean> {
    return this.dbRepository.existsBy({ ...dto });
  }

  async update(id: number, dto: UpdateQuestionDto): Promise<QuestionEntity> {
    await this.dbRepository.update(id, dto);
    return this.getOneBy({ id });
  }

  async search(dto: SearchQuestionDto): Promise<QuestionEntity[]> {
    const query = this.dbRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tags', 'tags')
      .leftJoinAndSelect('question.author', 'author')
      .leftJoinAndSelect('question.answers', 'answers')
      .leftJoinAndSelect('question.views', 'views')
      .leftJoinAndSelect('answers.author', 'answer_author');
    if (dto?.description) {
      query.where('question.title ILIKE :title', { title: `%${dto.title}%` });
    }

    if (dto?.id) {
      query.andWhere({ id: dto.id });
    }

    if (dto?.authorId) {
      query.andWhere({ authorId: dto.authorId });
    }

    if (dto?.description) {
      query.andWhere('question.description ILIKE :description', {
        description: `%${dto.description}%`,
      });
    }
    query.limit(dto.pageSize);
    query.offset(dto.pageSize * dto.page);

    const questions = await query.getMany();

    return dto.isResolved && questions.length
      ? questions.filter((question) =>
          question.answers.some((answer) => answer.isSolution),
        )
      : questions;
  }

  async updateRelations(id: number, dto: RelationQuestionDto) {
    await this.dbRepository.save({
      ...dto,
      id,
    });
    return this.getOneBy({ id });
  }

  async delete(id: number) {
    await this.dbRepository.softDelete({ id });
  }
}
