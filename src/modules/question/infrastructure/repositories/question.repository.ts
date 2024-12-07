import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionEntity } from '../../domain/entities/question.entity';
import { SearchQuestionDto } from '../../domain/dtos/search-question.dto';
import { ExistQuestionDto } from '../../domain/dtos/exist-question.dto';
import { UpdateQuestionDto } from '../../domain/dtos/update-question.dto';
import { CreateQuestionDto } from '../../domain/dtos/create-question.dto';
import { FilterQuestionEnum } from '../../domain/enums/filter-question.enum';
import { IQuestionRepository } from '../../domain/interfaces/i-question-repository';

@Injectable()
export class QuestionRepository implements IQuestionRepository {
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
      .leftJoinAndSelect('question.author', 'question_author')
      .leftJoinAndSelect('question.answers', 'answers')
      .leftJoinAndSelect('answers.author', 'answer_author')
      .leftJoinAndSelect('answer_author.avatar', 'answer_author_avatar')
      .leftJoinAndSelect('question.views', 'views')
      .leftJoinAndSelect('question.images', 'images')
      .leftJoinAndSelect('question.rating', 'rating')
      .leftJoinAndSelect('question_author.avatar', 'question_author_avatar')
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

  async search(dto: SearchQuestionDto) {
    const query = this.dbRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tags', 'tags')
      .leftJoinAndSelect('question.author', 'question_author')
      .leftJoinAndSelect('question.answers', 'answers')
      .leftJoinAndSelect('answers.author', 'answer_author')
      .leftJoinAndSelect('answer_author.avatar', 'answer_author_avatar')
      .leftJoinAndSelect('question.views', 'views')
      .leftJoinAndSelect('question.images', 'images')
      .leftJoinAndSelect('question.rating', 'rating')
      .leftJoinAndSelect('question_author.avatar', 'question_author_avatar')
      .orderBy('question."createdAt"', 'DESC')
      .limit(dto.pageSize)
      .offset(dto.pageSize * dto.page);

    switch (dto.filter) {
      case FilterQuestionEnum.CREATED_AT:
        break;
      case FilterQuestionEnum.RATING:
        query
          .addSelect(
            (subQuery) =>
              subQuery
                .select('COALESCE(SUM(rating.value), 0)')
                .from('question_rating', 'rating')
                .where('rating.questionId = question.id'),
            'sumRating',
          )
          .orderBy(`"sumRating"`, 'DESC');
        break;
      case FilterQuestionEnum.VIEWS:
        query
          .addSelect(
            (subQuery) =>
              subQuery
                .select('COALESCE(COUNT(views.id), 0)')
                .from('question_view', 'views')
                .where('views.questionId = question.id'),
            'viewCount',
          )
          .orderBy('"viewCount"', 'DESC');
        break;
      case FilterQuestionEnum.WITHOUT_ANSWER:
        query.where('answers.id IS NULL');
        break;
      default:
        throw new NotFoundException();
    }

    if (dto?.authorId) {
      query.andWhere({ authorId: dto.authorId });
    }

    if (dto?.favoriteUserId) {
      query.andWhere(
        'question.id IN (SELECT "questionId" FROM question_favorite WHERE question_favorite."userId" = :favoriteUserId)',
        { favoriteUserId: dto.favoriteUserId },
      );
    }

    if (dto?.answeredUserId) {
      query.andWhere(
        'answers.id IN (SELECT id FROM answer WHERE answer."authorId" = :answeredUserId)',
        { answeredUserId: dto.answeredUserId },
      );
    }

    if (dto?.title) {
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

    if (dto?.isResolved) {
      query.andWhere(
        'answers.id IN (SELECT id FROM answer WHERE answer."isSolution" = TRUE)',
      );
    }
    return query.getManyAndCount();
  }

  async getCountQuestions() {
    return await this.dbRepository.count();
  }

  async delete(id: number) {
    await this.dbRepository.softDelete({ id });
  }
}
