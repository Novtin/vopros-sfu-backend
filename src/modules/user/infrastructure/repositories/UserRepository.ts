import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserModel } from '../../domain/models/UserModel';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSearchDto } from '../../domain/dtos/UserSearchDto';
import { UserUpdateDto } from '../../domain/dtos/UserUpdateDto';
import { UserSortEnum } from '../../domain/enums/UserSortEnum';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserEntity } from '../entities/UserEntity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly dbRepository: Repository<UserModel>,
  ) {}

  existBy(dto: Partial<UserModel>): Promise<boolean> {
    return this.dbRepository.existsBy({ ...dto });
  }

  create(dto: Partial<UserModel>): Promise<UserModel> {
    return this.dbRepository.save({ ...dto });
  }

  async update(id: number, dto: UserUpdateDto) {
    await this.dbRepository.update(id, { ...dto });
    return this.getOneBy({ id });
  }

  private getUserQueryBuilder() {
    return this.dbRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.questions', 'questions')
      .leftJoinAndSelect('user.questionsFavorite', 'questionsFavorite')
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

  async getTotalUsers() {
    const query = await this.dbRepository
      .createQueryBuilder('user')
      .select('COUNT(*)', 'total')
      .getRawOne();
    return +query.total;
  }

  async search(dto: UserSearchDto): Promise<[UserModel[], number]> {
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

    switch (dto.sort) {
      case UserSortEnum.RATING:
        query.orderBy('rating', 'DESC');
        break;
      default:
        throw new NotFoundException();
    }

    if (dto.query) {
      query.andWhere('user.nickname ILIKE :query OR user.email ILIKE :query', {
        query: `%${dto.query}%`,
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
    await this.dbRepository.restore({ id });
  }
}
