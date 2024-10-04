import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchUserDto } from '../dtos/search-user.dto';
import { ExistUserDto } from '../dtos/exist-user.dto';
import { SaveUserDto } from '../dtos/save-user.dto';

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

  getOneBy(dto: SearchUserDto): Promise<UserEntity> {
    return this.dbRepository.createQueryBuilder().where(dto).getOne();
  }
}
