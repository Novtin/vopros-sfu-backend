import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { ExistUserDto } from '../dtos/exist-user.dto';
import { SaveUserDto } from '../dtos/save-user.dto';
import { FileService } from '../../../file/domain/services/file.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { IUserRepository } from '../interfaces/i-user-repository';
import { SearchUserDto } from '../dtos/search-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly fileService: FileService,
  ) {}

  async getOneBy(dto: Partial<UserModel>): Promise<UserModel> {
    await this.throwNotFoundExceptionIfNotExist(dto);
    return this.userRepository.getOneBy(dto);
  }

  existBy(dto: ExistUserDto): Promise<boolean> {
    return this.userRepository.existBy(dto);
  }

  create(dto: SaveUserDto): Promise<UserModel> {
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

  async uploadAvatar(
    id: number,
    avatarFile: Express.Multer.File,
  ): Promise<UserModel> {
    await this.throwNotFoundExceptionIfNotExist({ id });
    let userEntity: UserModel = await this.getOneBy({ id });
    const fileIdForDelete: number = userEntity.avatarId;
    userEntity = await this.update(userEntity.id, {
      avatarId: (await this.fileService.create(avatarFile)).id,
    });
    if (fileIdForDelete) {
      await this.fileService.delete(fileIdForDelete);
    }
    return userEntity;
  }

  async search(dto: SearchUserDto) {
    return this.userRepository.search(dto);
  }
}
