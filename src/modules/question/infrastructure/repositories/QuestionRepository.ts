import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionModel } from '../../domain/models/QuestionModel';
import { QuestionSearchDto } from '../../domain/dtos/QuestionSearchDto';
import { QuestionExistDto } from '../../domain/dtos/QuestionExistDto';
import { QuestionCreateDto } from '../../domain/dtos/QuestionCreateDto';
import { QuestionSortEnum } from '../../domain/enums/QuestionSortEnum';
import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { QuestionEntity } from '../entities/QuestionEntity';
import { IQuestionCount } from '../../domain/interfaces/IQuestionCount';

@Injectable()
export class QuestionRepository implements IQuestionRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly dbRepository: Repository<QuestionModel>,
  ) {}

  async create(dto: QuestionCreateDto): Promise<QuestionModel> {
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

  existBy(dto: QuestionExistDto): Promise<boolean> {
    return this.dbRepository.existsBy({ ...dto });
  }

  async update(
    id: number,
    dto: Partial<QuestionModel>,
  ): Promise<QuestionModel> {
    await this.dbRepository.save({ id, ...dto });
    return this.getOneBy({ id });
  }

  async search(dto: QuestionSearchDto) {
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

    switch (dto.sort) {
      case QuestionSortEnum.CREATED_AT:
        break;
      case QuestionSortEnum.RATING:
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
      case QuestionSortEnum.VIEWS:
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

    if (dto.tagIds) {
      query.andWhere(
        `EXISTS (
            SELECT 1 FROM question_tag qt
            WHERE qt."tagId" IN (:...tagIds)
            AND qt."questionId" = question.id
            GROUP BY qt."questionId"
            HAVING COUNT(DISTINCT qt."tagId") = :tagCount
          )`,
        { tagIds: dto.tagIds, tagCount: dto.tagIds.length },
      );
    }

    if (dto.isWithoutAnswer) {
      query.andWhere('answers.id IS NULL');
    }

    if (dto.isWithoutView) {
      query.andWhere(
        'NOT EXISTS (SELECT 1 FROM question_view v WHERE v."questionId" = question.id)',
      );
    }

    if (dto.isWithoutRating) {
      query.andWhere(
        'NOT EXISTS (SELECT 1 FROM question_rating r WHERE r."questionId" = question.id)',
      );
    }

    if (dto.favoriteUserId) {
      query.andWhere(
        'question.id IN (SELECT "questionId" FROM question_favorite WHERE question_favorite."userId" = :favoriteUserId)',
        { favoriteUserId: dto.favoriteUserId },
      );
    }

    if (dto.answeredUserId) {
      query.andWhere(
        'answers.id IN (SELECT id FROM answer WHERE answer."authorId" = :answeredUserId)',
        { answeredUserId: dto.answeredUserId },
      );
    }

    if (dto.title) {
      query.andWhere('question.title ILIKE :title', {
        title: `%${dto.title}%`,
      });
    }

    if (dto.id) {
      query.andWhere({ id: dto.id });
    }

    if (dto.authorId) {
      query.andWhere({ authorId: dto.authorId });
    }

    if (dto.description) {
      query.andWhere('question.description ILIKE :description', {
        description: `%${dto.description}%`,
      });
    }

    if (dto.isResolved) {
      query.andWhere(
        'answers.id IN (SELECT id FROM answer WHERE answer."isSolution" = TRUE)',
      );
    }
    return query.getManyAndCount();
  }

  async getCount(): Promise<IQuestionCount> {
    return { count: await this.dbRepository.count() };
  }

  async delete(id: number) {
    await this.dbRepository.softDelete({ id });
  }
}
