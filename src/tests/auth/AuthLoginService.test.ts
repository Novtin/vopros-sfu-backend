import {
  describe,
  beforeEach,
  it,
  expect,
  beforeAll,
  afterAll,
} from '@jest/globals';
import { refreshDatabase, getTestModule, createTestUser } from '../utils';
import { DataSource } from 'typeorm';
import { AuthLoginService } from '../../modules/auth/domain/services/AuthLoginService';
import { UserService } from '../../modules/user/domain/services/UserService';
import { IHashService } from '../../modules/auth/domain/interfaces/IHashService';
import { AuthLoginModel } from '../../modules/auth/domain/models/AuthLoginModel';
import { UnauthorizedException } from '../../modules/global/domain/exceptions/UnauthorizedException';
import { UserModel } from '../../modules/user/domain/models/UserModel';
import { IAuthLoginRepository } from '../../modules/auth/domain/interfaces/IAuthLoginRepository';

describe('AuthLoginService', () => {
  let authLoginService: AuthLoginService;
  let authLoginRepository: IAuthLoginRepository;
  let dataSource: DataSource;
  let userService: UserService;
  let hashService: IHashService;
  let user: UserModel;

  const createTestLogin = async (
    user: UserModel,
    ipAddress: string = '127.0.0.1',
  ) => authLoginService.create(user, ipAddress);

  beforeAll(async () => {
    const module = await getTestModule();

    authLoginService = module.get(AuthLoginService);
    dataSource = module.get(DataSource);
    userService = module.get(UserService);
    hashService = module.get(IHashService);
    authLoginRepository = module.get(IAuthLoginRepository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await refreshDatabase(dataSource);
    user = await createTestUser(userService, hashService);
  });

  describe('create', () => {
    it('should create AuthLoginModel', async () => {
      const ipAddress = '127.0.0.1';

      const authLoginModel = await authLoginService.create(user, ipAddress);

      expect(authLoginModel).toMatchObject({
        userId: user.id,
        isLogout: false,
        ipAddress: ipAddress,
      });
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const ipAddress = '127.0.0.1';
      const authLoginModel = await createTestLogin(user, ipAddress);

      const updatedAuthLoginModel = await authLoginService.refresh({
        refreshToken: authLoginModel.refreshToken,
        loginId: authLoginModel.id,
      });

      expect(updatedAuthLoginModel.id).toBe(authLoginModel.id);
      expect(updatedAuthLoginModel.refreshToken).not.toBe(
        authLoginModel.refreshToken,
      );
      expect(updatedAuthLoginModel.accessToken).not.toBe(
        authLoginModel.accessToken,
      );
      expect(updatedAuthLoginModel).toMatchObject({
        userId: user.id,
        isLogout: false,
        ipAddress: ipAddress,
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const authLoginModel = await createTestLogin(user);

      await expect(
        authLoginService.refresh({
          refreshToken: 'invalid_token',
          loginId: authLoginModel.id,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should login mark as isLogout', async () => {
      const authLoginModel = await createTestLogin(user);

      await authLoginService.logout(
        {
          loginId: authLoginModel.id,
        },
        user.id,
      );

      const updatedLoginModel = await authLoginRepository.getOneBy({
        id: authLoginModel.id,
      });

      expect(updatedLoginModel.isLogout).toBeTruthy();
      expect(updatedLoginModel.id).toBe(authLoginModel.id);
    });
  });

  describe('checkExistLogin', () => {
    it('should not throw the exception to the not logout model', () => {
      const model = { isLogout: false } as AuthLoginModel;
      expect(() => authLoginService.checkExistLogin(model)).not.toThrow();
    });

    it('should throw the exception to the logout or null model', () => {
      const model = { isLogout: true } as AuthLoginModel;
      expect(() => authLoginService.checkExistLogin(model)).toThrow(
        UnauthorizedException,
      );

      expect(() => authLoginService.checkExistLogin(null)).toThrow(
        UnauthorizedException,
      );
    });
  });
});
