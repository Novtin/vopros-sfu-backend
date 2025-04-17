import { TestingModule } from '@nestjs/testing';
import { AuthService } from '../../modules/auth/domain/services/AuthService';
import { UserService } from '../../modules/user/domain/services/UserService';
import {
  describe,
  expect,
  it,
  beforeAll,
  beforeEach,
  afterAll,
} from '@jest/globals';
import { AuthRegisterDto } from '../../modules/auth/domain/dtos/AuthRegisterDto';
import { AuthRefreshDto } from '../../modules/auth/domain/dtos/AuthRefreshDto';
import { IHashService } from '../../modules/auth/domain/interfaces/IHashService';
import { ForbiddenException } from '../../modules/global/domain/exceptions/ForbiddenException';
import { IAuthLogin } from '../../modules/auth/domain/interfaces/IAuthLogin';
import { AuthLogoutDto } from '../../modules/auth/domain/dtos/AuthLogoutDto';
import { ContextDto } from '../../modules/auth/domain/dtos/ContextDto';
import { refreshDatabase, getTestModule, createTestUser } from '../utils';
import { DataSource } from 'typeorm';
import { UnauthorizedException } from '../../modules/global/domain/exceptions/UnauthorizedException';
import { UserModel } from '../../modules/user/domain/models/UserModel';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let hashService: IHashService;
  let dataSource: DataSource;
  let user: UserModel;

  beforeAll(async () => {
    const module: TestingModule = await getTestModule();

    authService = module.get(AuthService);
    userService = module.get(UserService);
    hashService = module.get(IHashService);
    dataSource = module.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await refreshDatabase(dataSource);
    user = await createTestUser(userService, hashService);
  });

  describe('login', () => {
    it('should throw ForbiddenException if user is not confirmed', async () => {
      const loginDto: IAuthLogin = {
        email: user.email,
        password: '1',
        ipAddress: '1',
      };

      await expect(authService.login(loginDto)).rejects.toThrowError(
        ForbiddenException,
      );
    });

    it('should throw exception if password is invalid', async () => {
      const loginDto: IAuthLogin = {
        email: user.email,
        password: 'password',
        ipAddress: '1',
      };

      await expect(authService.login(loginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should return AuthLoginModel if login is successful', async () => {
      const loginDto: IAuthLogin = {
        email: user.email,
        password: '1',
        ipAddress: '1',
      };

      const authLoginModel = await authService.login(loginDto);

      expect(authLoginModel).toMatchObject({
        userId: user.id,
        isLogout: false,
        ipAddress: loginDto.ipAddress,
      });
    });
  });

  describe('register', () => {
    it('should create a user', async () => {
      const registerDto: AuthRegisterDto = {
        email: 'test@example.com',
        password: 'test',
        nickname: 'test',
      };

      const userModel = await authService.register(registerDto);

      expect(userModel).toMatchObject({
        email: registerDto.email,
        nickname: registerDto.nickname,
      });
      await expect(
        hashService.compareTextAndHash(
          registerDto.password,
          userModel.passwordHash,
        ),
      ).resolves.toBeTruthy();
    });
  });

  describe('refresh', () => {
    it('should call AuthLoginService.refresh', async () => {
      const loginDto: IAuthLogin = {
        email: user.email,
        password: '1',
        ipAddress: '1',
      };

      const authLoginModel = await authService.login(loginDto);

      const refreshDto: AuthRefreshDto = {
        loginId: authLoginModel.id,
        refreshToken: authLoginModel.refreshToken,
      };

      const updatedAuthLoginModel = await authService.refresh(refreshDto);

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
        ipAddress: loginDto.ipAddress,
      });
    });
  });

  describe('logout', () => {
    it('should call AuthLoginService.logout', async () => {
      const loginDto: IAuthLogin = {
        email: user.email,
        password: '1',
        ipAddress: '1',
      };

      const authLoginModel = await authService.login(loginDto);
      const logoutDto: AuthLogoutDto = {
        loginId: authLoginModel.id,
      };
      const contextDto: ContextDto = {
        email: user.email,
        userId: user.id,
        roles: user.roles.map((role) => role.name),
      };

      await authService.logout(logoutDto, contextDto);

      const refreshDto: AuthRefreshDto = {
        loginId: authLoginModel.id,
        refreshToken: authLoginModel.refreshToken,
      };

      await expect(authService.refresh(refreshDto)).rejects.toThrow();
    });
  });
});
