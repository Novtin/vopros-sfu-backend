import { Inject, Injectable } from '@nestjs/common';
import { UserModel } from '../models/UserModel';
import { UserSaveDto } from '../dtos/UserSaveDto';
import { FileService } from '../../../file/domain/services/FileService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { UserSearchDto } from '../dtos/UserSearchDto';
import { ContextDto } from '../../../auth/domain/dtos/ContextDto';
import { RoleEnum } from '../enums/RoleEnum';
import { NotFoundException } from '../../../global/domain/exceptions/NotFoundException';
import { ForbiddenException } from '../../../global/domain/exceptions/ForbiddenException';
import { BadRequestException } from '../../../global/domain/exceptions/BadRequestException';
import { UnprocessableEntityException } from '../../../global/domain/exceptions/UnprocessableEntityException';
import { IHashService } from '../../../auth/domain/interfaces/IHashService';
import { UserPasswordUpdateDto } from '../dtos/UserPasswordUpdateDto';
import { sample as _sample } from 'lodash';
import { IFile } from '../../../file/domain/interfaces/IFile';

@Injectable()
export class UserService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly fileService: FileService,
    @Inject(IHashService)
    private readonly hashService: IHashService,
  ) {}

  async getOneBy(dto: Partial<UserModel>): Promise<UserModel> {
    await this.throwNotFoundExceptionIfNotExist(dto);
    return this.userRepository.getOneBy(dto);
  }

  existBy(dto: Partial<UserModel>): Promise<boolean> {
    return this.userRepository.existBy(dto);
  }

  async create(dto: UserSaveDto): Promise<UserModel> {
    try {
      const { fileIds } = await this.fileService.getExampleIds();
      return await this.userRepository.create({
        ...dto,
        avatarId: _sample(fileIds),
      });
    } catch (error) {
      if (error?.code === '23505') {
        throw new UnprocessableEntityException(
          'Пользователь с таким email забанен',
        );
      }
    }
  }

  async updateThis(
    userId: number,
    contextUserId: number,
    dto: Partial<UserModel>,
  ) {
    this.throwForbiddenExceptionIfNotThis(userId, contextUserId);
    return this.update(userId, dto);
  }

  async update(id: number, dto: Partial<UserModel>) {
    await this.throwNotFoundExceptionIfNotExist({ id });
    delete dto.id;
    return this.userRepository.update(id, dto);
  }

  async throwNotFoundExceptionIfNotExist(dto: Partial<UserModel>) {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException();
    }
  }

  throwForbiddenExceptionIfNotThisOrAdmin(context: ContextDto, userId: number) {
    if (!context.roles.includes(RoleEnum.ADMIN)) {
      this.throwForbiddenExceptionIfNotThis(context.userId, userId);
    }
  }

  throwForbiddenExceptionIfNotThis(contextUserId: number, userId: number) {
    if (contextUserId !== userId) {
      throw new ForbiddenException();
    }
  }

  async uploadAvatar(id: number, avatarFile: IFile): Promise<UserModel> {
    if (!avatarFile) {
      throw new BadRequestException('Файл не найден');
    }
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

  async search(dto: UserSearchDto) {
    return this.userRepository.search(dto);
  }

  async delete(id: number, context: ContextDto) {
    this.throwForbiddenExceptionIfNotThisOrAdmin(context, id);
    await this.userRepository.delete(id);
  }

  async restore(id: number) {
    await this.userRepository.restore(id);
  }

  async updatePassword(dto: UserPasswordUpdateDto) {
    await this.throwNotFoundExceptionIfNotExist({ id: dto.userId });

    const newPasswordHash = await this.hashService.makeHash(dto.password);

    await this.update(dto.userId, {
      passwordHash: newPasswordHash,
    });
  }
}
