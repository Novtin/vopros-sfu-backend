import { TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../modules/auth/domain/services/auth.service';
import { UserService } from '../../../modules/user/domain/services/user.service';
import {
  describe,
  expect,
  it,
  beforeAll,
  beforeEach,
  afterAll,
} from '@jest/globals';
import { RegisterDto } from '../../../modules/auth/domain/dtos/register.dto';
import { RefreshDto } from '../../../modules/auth/domain/dtos/refresh.dto';
import { RoleModel } from '../../../modules/user/domain/models/role.model';
import { IHashService } from '../../../modules/auth/domain/interfaces/i-hash-service';
import { ForbiddenException } from '../../../modules/global/domain/exceptions/forbidden.exception';
import { IAuthLogin } from '../../../modules/auth/domain/interfaces/i-auth-login';
import { LogoutDto } from '../../../modules/auth/domain/dtos/logout.dto';
import { ContextDto } from '../../../modules/auth/domain/dtos/context.dto';
import { clearDatabase, getTestModule } from '../../utils';
import { DataSource } from 'typeorm';
import { IUserRepository } from '../../../modules/user/domain/interfaces/i-user-repository';
import { UnauthorizedException } from '../../../modules/global/domain/exceptions/unauthorized.exception';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let hashService: IHashService;
  let dataSource: DataSource;
  let userRepository: IUserRepository;

  beforeAll(async () => {
    const module: TestingModule = await getTestModule();

    authService = module.get(AuthService);
    userService = module.get(UserService);
    hashService = module.get(IHashService);
    dataSource = module.get(DataSource);
    userRepository = module.get(IUserRepository);

    await dataSource.runMigrations();
  });

  beforeEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await clearDatabase(dataSource);
    //await dataSource.destroy();
  });

  describe('login', () => {
    it('should throw ForbiddenException if user is not confirmed', async () => {
      const user = await userService.create({
        email: 'email@email.com',
        nickname: 'nickname',
        passwordHash: await hashService.makeHash('1'),
        description: 'description',
        roles: [
          {
            id: 1,
            name: 'user',
          } as RoleModel,
        ],
      });

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
      const user = await userRepository.create({
        email: 'email@email.com',
        nickname: 'nickname',
        passwordHash: await hashService.makeHash('1'),
        description: 'description',
        isConfirmed: true,
        roles: [
          {
            id: 1,
            name: 'user',
          } as RoleModel,
        ],
      });
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
      const user = await userRepository.create({
        email: 'email@email.com',
        nickname: 'nickname',
        passwordHash: await hashService.makeHash('1'),
        description: 'description',
        isConfirmed: true,
        roles: [
          {
            id: 1,
            name: 'user',
          } as RoleModel,
        ],
      });

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
      const registerDto: RegisterDto = {
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
      const user = await userRepository.create({
        email: 'email@email.com',
        nickname: 'nickname',
        passwordHash: await hashService.makeHash('1'),
        description: 'description',
        isConfirmed: true,
        roles: [
          {
            id: 1,
            name: 'user',
          } as RoleModel,
        ],
      });
      const loginDto: IAuthLogin = {
        email: user.email,
        password: '1',
        ipAddress: '1',
      };

      const authLoginModel = await authService.login(loginDto);

      const refreshDto: RefreshDto = {
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
      const user = await userRepository.create({
        email: 'email@email.com',
        nickname: 'nickname',
        passwordHash: await hashService.makeHash('1'),
        description: 'description',
        isConfirmed: true,
        roles: [
          {
            id: 1,
            name: 'user',
          } as RoleModel,
        ],
      });
      const loginDto: IAuthLogin = {
        email: user.email,
        password: '1',
        ipAddress: '1',
      };

      const authLoginModel = await authService.login(loginDto);
      const logoutDto: LogoutDto = {
        loginId: authLoginModel.id,
      };
      const contextDto: ContextDto = {
        email: user.email,
        userId: user.id,
        roles: user.roles.map((role) => role.name),
      };

      await authService.logout(logoutDto, contextDto);

      const refreshDto: RefreshDto = {
        loginId: authLoginModel.id,
        refreshToken: authLoginModel.refreshToken,
      };

      await expect(authService.refresh(refreshDto)).rejects.toThrow();
    });
  });
});
