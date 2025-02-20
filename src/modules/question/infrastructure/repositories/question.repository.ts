import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionModel } from '../../domain/models/question.model';
import { SearchQuestionDto } from '../../domain/dtos/search-question.dto';
import { ExistQuestionDto } from '../../domain/dtos/exist-question.dto';
import { CreateQuestionDto } from '../../domain/dtos/create-question.dto';
import { FilterQuestionEnum } from '../../domain/enums/filter-question.enum';
import { IQuestionRepository } from '../../domain/interfaces/i-question-repository';
import { QuestionEntity } from '../entities/question.entity';
import { IQuestionCount } from '../../domain/interfaces/i-question-count';

@Injectable()
export class QuestionRepository implements IQuestionRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly dbRepository: Repository<QuestionModel>,
  ) {}

  async create(dto: CreateQuestionDto): Promise<QuestionModel> {
    const model = await this.dbRepository.save({ ...dto });
    return this.getOneBy({ id: model.id });
  }

  async getOneBy(dto: Partial<QuestionModel>): Promise<QuestionModel> {
    return this.dbRepository.findOne({
      where: { ...dto },
      relations: [
        'tags',
        'author',
        'answers',
        'answers.author',
        'answers.author.avatar',
        'views',
        'images',
        'rating',
        'author.avatar',
      ],
    });
  }

  existBy(dto: ExistQuestionDto): Promise<boolean> {
    return this.dbRepository.existsBy({ ...dto });
  }

  async update(
    id: number,
    dto: Partial<QuestionModel>,
  ): Promise<QuestionModel> {
    await this.dbRepository.save({ id, ...dto });
    console.log(await this.getOneBy({ id }));
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
      .take(dto.pageSize)
      .skip(dto.pageSize * dto.page);

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
                .select('COALESCE(COUNT(*), 0)')
                .from('question_view', 'views')
                .where('views.questionId = question.id'),
            'viewCount',
          )
          .orderBy('"viewCount"', 'DESC');
        break;
      default:
        throw new NotFoundException();
    }

    if (dto?.authorId) {
      query.andWhere({ authorId: dto.authorId });
    }

    if (dto?.isWithoutAnswer) {
      query.where('answers.id IS NULL');
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

  async getCountQuestions(): Promise<IQuestionCount> {
    return { count: await this.dbRepository.count() };
  }

  async delete(id: number) {
    await this.dbRepository.softDelete({ id });
  }
}
