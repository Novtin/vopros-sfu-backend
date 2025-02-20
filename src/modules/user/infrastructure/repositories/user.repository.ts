import { Injectable, NotFoundException } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { UserModel } from '../../domain/models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchUserDto } from '../../domain/dtos/search-user.dto';
import { ExistUserDto } from '../../domain/dtos/exist-user.dto';
import { UpdateUserDto } from '../../domain/dtos/update-user.dto';
import { FilterUserEnum } from '../../domain/enum/filter-user.enum';
import { IUserRepository } from '../../domain/interfaces/i-user-repository';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly dbRepository: Repository<UserModel>,
  ) {}

  existBy(dto: ExistUserDto): Promise<boolean> {
    return this.dbRepository.existsBy({ ...dto });
  }

  create(dto: Partial<UserModel>): Promise<UserModel> {
    return this.dbRepository.save({ ...dto });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.dbRepository.update(id, { ...dto });
    return this.getOneBy({ id });
  }

  async confirmEmail(id: number) {
    await this.dbRepository.update(id, { isConfirmed: true });
    return this.getOneBy({ id });
  }

  private getUserQueryBuilder() {
    return this.dbRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.questions', 'questions')
      .leftJoinAndSelect('user.answers', 'answers')
      .addSelect(
        `COALESCE(
        (SELECT COALESCE(SUM(question_rating.value), 0) 
        FROM question_rating 
        WHERE question_rating."questionId" = questions.id), 0) 
        + COALESCE(
        (SELECT COALESCE(SUM(answer_rating.value), 0) 
        FROM answer_rating WHERE answer_rating."answerId" = answers.id), 0)`,
        'rating',
      );
  }

  async getOneBy(dto: Partial<UserModel>): Promise<UserModel> {
    const { entities, raw } = await this.getUserQueryBuilder()
      .where(dto)
      .take(1)
      .getRawAndEntities();

    return {
      ...entities[0],
      rating: raw.find((item) => item.user_id === entities[0].id).rating,
    };
  }

  private getAllRating(userIds: number[]) {
    return this.dbRepository
      .createQueryBuilder('user')
      .leftJoin('user.questions', 'question')
      .leftJoin('user.answers', 'answer')
      .leftJoin('question.rating', 'question_rating')
      .leftJoin('answer.rating', 'answer_rating')
      .select('user.id', 'userId')
      .addSelect(
        (qb) =>
          qb
            .select(
              'COALESCE(SUM(question_rating.value), 0)',
              'totalQuestionRating',
            )
            .from('question_rating', 'question_rating')
            .where('question_rating.questionId = question.id'),
        'questionRating',
      )
      .addSelect(
        (qb) =>
          qb
            .select(
              'COALESCE(SUM(answer_rating.value), 0)',
              'totalAnswerRating',
            )
            .from('answer_rating', 'answer_rating')
            .where('answer_rating.answerId = answer.id'),
        'answerRating',
      )
      .where('user.id IN (:...userIds)', { userIds })
      .getRawMany<{
        userId: number;
        questionRating: number;
        answerRating: number;
      }>();
  }

  async getTotalUsers() {
    const query = await this.dbRepository
      .createQueryBuilder('user')
      .select('COUNT(*)', 'total')
      .getRawOne();
    return query.total;
  }

  async search(dto: SearchUserDto): Promise<[UserModel[], number]> {
    const query = this.getUserQueryBuilder()
      .leftJoinAndSelect('questions.rating', 'questions_rating')
      .leftJoinAndSelect('answers.rating', 'answers_rating')
      .addSelect(
        `COALESCE(
        (SELECT COALESCE(SUM(question_rating.value), 0)
         FROM question_rating WHERE question_rating."questionId" = questions.id), 0)
          + COALESCE(
          (SELECT COALESCE(SUM(answer_rating.value), 0) FROM answer_rating 
          WHERE answer_rating."answerId" = answers.id), 0)`,
        'rating',
      )
      .limit(dto.pageSize)
      .offset(dto.pageSize * dto.page);

    switch (dto.filter) {
      case FilterUserEnum.RATING:
        query.orderBy('rating', 'DESC');
        break;
      default:
        throw new NotFoundException();
    }

    if (dto.query) {
      query.orWhere('user.nickname ILIKE :nickname', {
        nickname: `%${dto.query}%`,
      });
      query.orWhere('user.email ILIKE :email', {
        email: `%${dto.query}%`,
      });
    }

    if (dto.id) {
      query.andWhere({ id: dto.id });
    }

    if (dto.withDeleted) {
      query.andWhere('user.deletedAt IS NOT NULL OR user.deletedAt IS NULL');
    }

    const { entities, raw } = await query.getRawAndEntities();

    const users = entities.map((entity) => ({
      ...entity,
      rating: raw.find((item) => item.user_id === entity.id).rating,
    }));

    return [users, await this.getTotalUsers()];
  }

  async delete(id: number): Promise<void> {
    await this.dbRepository.softDelete({ id });
  }

  async restore(id: number): Promise<void> {
    await this.dbRepository.update(
      { id, deletedAt: Not(IsNull()) },
      { deletedAt: null },
    );
  }

  private async setRating(users: UserModel[]) {
    const allUserRating = await this.getAllRating(users.map((user) => user.id));
    return users.map((user) => {
      const userRating = allUserRating.find(
        (userRating) => userRating.userId === user.id,
      );
      user.rating = userRating
        ? userRating.answerRating + userRating.questionRating
        : 0;
      return user;
    });
  }
}
