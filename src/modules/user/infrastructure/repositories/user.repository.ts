import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchUserDto } from '../../domain/dtos/search-user.dto';
import { ExistUserDto } from '../../domain/dtos/exist-user.dto';
import { SaveUserDto } from '../../domain/dtos/save-user.dto';
import { UpdateUserDto } from '../../domain/dtos/update-user.dto';
import { RelationUserDto } from '../../domain/dtos/relation-user.dto';
import { FilterUserEnum } from '../../domain/enum/filter-user.enum';
import { IUserRepository } from '../../domain/interfaces/i-user-repository';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly dbRepository: Repository<UserEntity>,
  ) {}

  existBy(dto: ExistUserDto): Promise<boolean> {
    return this.dbRepository.existsBy({ ...dto });
  }

  create(dto: SaveUserDto): Promise<UserEntity> {
    return this.dbRepository.save({ ...dto });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.dbRepository.update(id, { ...dto });
    return this.getOneBy({ id });
  }

  async updateRelations(id: number, dto: RelationUserDto) {
    await this.dbRepository.update(id, { ...dto });
    return this.getOneBy({ id });
  }

  async confirmEmail(id: number) {
    await this.dbRepository.update(id, { isConfirmed: true });
    return this.getOneBy({ id });
  }

  getOneBy(dto: Partial<UserEntity>): Promise<UserEntity> {
    return this.dbRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('user.roles', 'roles')
      .where(dto)
      .limit(1)
      .getOne();
  }

  async search(dto: SearchUserDto) {
    const query = this.dbRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('user.questions', 'questions')
      .leftJoinAndSelect('user.answers', 'answers')
      .leftJoinAndSelect('questions.rating', 'questions_rating')
      .leftJoinAndSelect('answers.rating', 'answers_rating')
      .addSelect(
        `COALESCE((SELECT COALESCE(SUM(question_rating.value), 0) FROM question_rating WHERE question_rating."questionId" = questions.id), 0) + COALESCE((SELECT COALESCE(SUM(answer_rating.value), 0) FROM answer_rating WHERE answer_rating."answerId" = answers.id), 0)`,
        'user_rating',
      )
      .limit(dto.pageSize)
      .offset(dto.pageSize * dto.page);

    switch (dto.filter) {
      case FilterUserEnum.RATING:
        query.orderBy('user_rating', 'DESC');
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

    return query.getManyAndCount();
  }
}
