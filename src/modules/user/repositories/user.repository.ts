import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchUserDto } from '../dtos/search-user.dto';
import { ExistUserDto } from '../dtos/exist-user.dto';
import { SaveUserDto } from '../dtos/save-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { RelationUserDto } from '../dtos/relation-user.dto';

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

  async confirmEmail(id: number){
    await this.dbRepository.update(id, { isConfirmed: true });
    return this.getOneBy({ id });
  }


  getOneBy(dto: SearchUserDto): Promise<UserEntity> {
    return this.dbRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .where(dto)
      .limit(1)
      .getOne();
  }
}
