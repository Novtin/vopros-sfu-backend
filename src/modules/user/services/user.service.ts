import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { SearchUserDto } from '../dtos/search-user.dto';
import { ExistUserDto } from '../dtos/exist-user.dto';
import { SaveUserDto } from '../dtos/save-user.dto';
import { FileService } from '../../file/services/file.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { RelationUserDto } from '../dtos/relation-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileService: FileService,
  ) {}

  async getOneBy(dto: SearchUserDto): Promise<UserEntity> {
    await this.throwNotFoundExceptionIfNotExist(dto);
    return this.userRepository.getOneBy(dto);
  }

  existBy(dto: ExistUserDto): Promise<boolean> {
    return this.userRepository.existBy(dto);
  }

  create(dto: SaveUserDto): Promise<UserEntity> {
    return this.userRepository.create(dto);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.throwNotFoundExceptionIfNotExist({ id });
    return this.userRepository.update(id, dto);
  }

  async confirmEmail(id: number) {
    return this.userRepository.confirmEmail(id);
  }

  async throwNotFoundExceptionIfNotExist(dto: ExistUserDto) {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException();
    }
  }

  async updateRelations(id: number, dto: RelationUserDto) {
    await this.throwNotFoundExceptionIfNotExist({ id });
    return this.userRepository.updateRelations(id, dto);
  }

  async uploadAvatar(
    id: number,
    avatarFile: Express.Multer.File,
  ): Promise<UserEntity> {
    await this.throwNotFoundExceptionIfNotExist({ id });
    let userEntity: UserEntity = await this.getOneBy({ id });
    const fileIdForDelete: number = userEntity.avatarId;
    userEntity = await this.updateRelations(userEntity.id, {
      avatarId: (await this.fileService.create(avatarFile)).id,
    });
    if (fileIdForDelete) {
      await this.fileService.delete(fileIdForDelete);
    }
    return userEntity;
  }
}
