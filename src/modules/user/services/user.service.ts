import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { SearchUserDto } from '../dtos/search-user.dto';
import { ExistUserDto } from '../dtos/exist-user.dto';
import { SaveUserDto } from '../dtos/save-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getOneBy(dto: SearchUserDto): Promise<UserEntity> {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException();
    }
    return this.userRepository.getOneBy(dto);
  }

  existBy(dto: ExistUserDto): Promise<boolean> {
    return this.userRepository.existBy(dto);
  }

  create(dto: SaveUserDto): Promise<UserEntity> {
    return this.userRepository.create(dto);
  }
}
