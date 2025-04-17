import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { DataSource } from 'typeorm';
import { createTestUser, getTestModule, refreshDatabase } from '../utils';
import { NotFoundException } from '../../modules/global/domain/exceptions/NotFoundException';
import { UserService } from '../../modules/user/domain/services/UserService';
import { UserModel } from '../../modules/user/domain/models/UserModel';
import { IHashService } from '../../modules/auth/domain/interfaces/IHashService';
import { RoleModel } from '../../modules/user/domain/models/RoleModel';
import { UserSaveDto } from '../../modules/user/domain/dtos/UserSaveDto';
import { RoleEnum } from '../../modules/user/domain/enums/RoleEnum';
import { ContextDto } from '../../modules/auth/domain/dtos/ContextDto';
import { ConflictException } from '../../modules/global/domain/exceptions/ConflictException';
import { IFile } from '../../modules/file/domain/interfaces/IFile';
import { FileService } from '../../modules/file/domain/services/FileService';
import { BadRequestException } from '../../modules/global/domain/exceptions/BadRequestException';
import { UserPasswordUpdateDto } from '../../modules/user/domain/dtos/UserPasswordUpdateDto';
import { UserSearchDto } from '../../modules/user/domain/dtos/UserSearchDto';
import { UserSortEnum } from '../../modules/user/domain/enums/UserSortEnum';

describe('UserService', () => {
  let userService: UserService;
  let hashService: IHashService;
  let fileService: FileService;
  let dataSource: DataSource;
  let user: UserModel;

  beforeAll(async () => {
    const moduleRef = await getTestModule();

    userService = moduleRef.get(UserService);
    hashService = moduleRef.get(IHashService);
    dataSource = moduleRef.get(DataSource);
    fileService = moduleRef.get(FileService);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await refreshDatabase(dataSource);
    user = await createTestUser(userService, hashService);
  });

  describe('getOneBy', () => {
    it('should return UserModel', async () => {
      expect(await userService.getOneBy({ id: user.id })).toMatchObject({
        ...user,
        roles: [],
      });
    });
    it('should throw NotFoundException', async () => {
      await expect(userService.getOneBy({ id: 0 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create UserModel', async () => {
      const dto: UserSaveDto = {
        email: 'test@email.com',
        nickname: 'test',
        passwordHash: await hashService.makeHash('1'),
        description: 'description',
        roles: [
          {
            id: 1,
            name: 'user',
          } as RoleModel,
        ],
      };
      const createdUser = await userService.create(dto);

      expect(createdUser).toMatchObject(dto as Record<string, any>);
    });
    it('should throw ConflictException if user is deleted', async () => {
      await userService.delete(user.id, {
        roles: [RoleEnum.ADMIN],
      } as ContextDto);

      await expect(
        userService.create({
          email: user.email,
          nickname: user.nickname,
          passwordHash: user.passwordHash,
          description: user.description,
          roles: user.roles,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const isConfirmed = user.isConfirmed;
      const updatedUser = await userService.update(user.id, {
        isConfirmed: true,
      });
      expect(isConfirmed).not.toBe(updatedUser.isConfirmed);
    });

    it('should throw NotFoundException if user is not exists', async () => {
      await expect(
        userService.update(0, {
          isConfirmed: true,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('uploadAvatar', () => {
    it('should upload avatar to user', async () => {
      const avatar: IFile = {
        filename: 'test.png',
        size: 1234,
        mimetype: 'image/png',
      };
      const updatedUser = await userService.uploadAvatar(user.id, avatar);
      expect(updatedUser.avatar).toMatchObject({
        name: avatar.filename,
        mimetype: avatar.mimetype,
        size: avatar.size,
      });
    });
    it('should throw BadRequestException if avatar is not exists', async () => {
      await expect(
        userService.uploadAvatar(user.id, undefined),
      ).rejects.toThrow(BadRequestException);
    });
    it('should delete previous avatar if it is exists', async () => {
      const avatar: IFile = {
        filename: 'test.png',
        size: 1234,
        mimetype: 'image/png',
      };
      const firstUpdatedUser = await userService.uploadAvatar(user.id, avatar);
      const secondUpdatedUser = await userService.uploadAvatar(user.id, avatar);
      expect(firstUpdatedUser.avatarId).not.toBe(secondUpdatedUser.avatarId);
      await expect(
        fileService.getOneBy({ id: firstUpdatedUser.avatarId }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePassword', () => {
    it('should update password of user', async () => {
      const previousPasswordHash = user.passwordHash;
      const dto: UserPasswordUpdateDto = {
        userId: user.id,
        password: 'newPassword!',
      };
      await userService.updatePassword(dto);

      const updatedUser = await userService.getOneBy({ id: user.id });

      expect(previousPasswordHash).not.toBe(updatedUser.passwordHash);
      await expect(
        hashService.compareTextAndHash(dto.password, updatedUser.passwordHash),
      ).resolves.toBeTruthy();
    });

    it('should throw NotFoundException if user is not exists', async () => {
      await expect(
        userService.updatePassword({
          userId: 0,
          password: 'newPassword!',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('should find users', async () => {
      const dto = new UserSearchDto();
      dto.sort = UserSortEnum.RATING;
      dto.query = user.nickname.slice(0, 2);
      const [users, total] = await userService.search(dto);

      expect(total).toBe(2);
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe(user.id);
    });

    it('should not find users', async () => {
      const dto = new UserSearchDto();
      dto.sort = UserSortEnum.RATING;
      dto.query = 'dasfjadhskfsdjfkekwueh178231123810jxza1';
      const [users, total] = await userService.search(dto);

      expect(total).toBe(2);
      expect(users).toHaveLength(0);
    });
  });
});
