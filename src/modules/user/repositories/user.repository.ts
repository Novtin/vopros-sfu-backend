import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchUserDto } from '../dtos/search-user.dto';
import { ExistUserDto } from '../dtos/exist-user.dto';
import { SaveUserDto } from '../dtos/save-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { RelationUserDto } from '../dtos/relation-user.dto';
import { FilterUserDto } from '../dtos/filter-user.dto';
import { FilterUserEnum } from '../enum/filter-user.enum';

@Injectable()
export class UserRepository {
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

  getOneBy(dto: SearchUserDto): Promise<UserEntity> {
    return this.dbRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('user.roles', 'roles')
      .where(dto)
      .limit(1)
      .getOne();
  }

  async filter(dto: FilterUserDto) {
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

    return query.getManyAndCount();
  }
}
