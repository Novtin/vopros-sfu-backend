import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../modules/auth/domain/services/auth.service';
import { UserService } from '../../modules/user/domain/services/user.service';
import { AuthTokenService } from '../../modules/auth/domain/services/auth-token.service';
import { RoleService } from '../../modules/user/domain/services/role.service';
import { UserModel } from '../../modules/user/domain/models/user.model';
import { describe, expect, it, beforeAll } from '@jest/globals';
import { RoleEnum } from '../../modules/user/domain/enums/role.enum';
import { RegisterDto } from '../../modules/auth/domain/dtos/register.dto';
import { RefreshDto } from '../../modules/auth/domain/dtos/refresh.dto';
import { RoleModel } from '../../modules/user/domain/models/role.model';
import { IEventEmitterService } from '../../modules/global/domain/interfaces/i-event-emitter-service';
import { IConfigService } from '../../modules/global/domain/interfaces/i-config-service';
import { IHashService } from '../../modules/auth/domain/interfaces/i-hash-service';
import { ForbiddenException } from '../../modules/global/domain/exceptions/forbidden.exception';
import { UnauthorizedException } from '../../modules/global/domain/exceptions/unauthorized.exception';
import { IAuthLogin } from '../../modules/auth/domain/interfaces/i-auth-login';
import { AuthLoginService } from '../../modules/auth/domain/services/auth-login.service';
import { AuthCodeService } from '../../modules/auth/domain/services/auth-code.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { AuthLoginModel } from '../../modules/auth/domain/models/auth-login.model';
import { LogoutDto } from '../../modules/auth/domain/dtos/logout.dto';
import { ContextDto } from '../../modules/auth/domain/dtos/context.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let authLoginService: AuthLoginService;
  let userService: UserService;
  let hashService: IHashService;
  let roleService: RoleService;

  beforeAll(async () => {
    const mockUserService = {
      getOneBy: jest.fn(),
      create: jest.fn(),
      confirmEmail: jest.fn(),
    };

    const mockAuthLoginService = {
      create: jest.fn(),
      refresh: jest.fn(),
      logout: jest.fn(),
    };

    const mockAuthCodeService = {
      createOrUpdate: jest.fn(),
      confirm: jest.fn(),
    };

    const mockTokenService = {
      makeTokens: jest.fn(),
      verify: jest.fn(),
    };

    const mockHashService = {
      makeHash: jest.fn(),
      compareTextAndHash: jest.fn(),
    };

    const mockRoleService = {
      getOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: AuthTokenService, useValue: mockTokenService },
        { provide: IHashService, useValue: mockHashService },
        { provide: RoleService, useValue: mockRoleService },
        { provide: IEventEmitterService, useClass: EventEmitter2 },
        { provide: IConfigService, useValue: ConfigService },
        { provide: AuthLoginService, useValue: mockAuthLoginService },
        { provide: AuthCodeService, useValue: mockAuthCodeService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    hashService = module.get<IHashService>(IHashService);
    roleService = module.get<RoleService>(RoleService);
    authLoginService = module.get<AuthLoginService>(AuthLoginService);
  });

  describe('login', () => {
    it('should throw ForbiddenException if user is not confirmed', async () => {
      const loginDto: IAuthLogin = {
        email: 'test@example.com',
        password: 'password',
        ipAddress: '1',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        nickname: 'test',
        isConfirmed: false,
        passwordHash: 'test',
      } as UserModel;
      userService.getOneBy = jest.fn().mockResolvedValue(user);

      await expect(authService.login(loginDto)).rejects.toThrowError(
        ForbiddenException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto: IAuthLogin = {
        email: 'test@example.com',
        password: 'password',
        ipAddress: '1',
      };

      const user = {
        isConfirmed: true,
        passwordHash: 'hashedPassword',
        roles: [],
      } as UserModel;
      userService.getOneBy = jest.fn().mockResolvedValue(user);
      hashService.compareTextAndHash = jest.fn().mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should return AuthLoginModel if login is successful', async () => {
      const loginDto: IAuthLogin = {
        email: 'test@example.com',
        password: 'password',
        ipAddress: '1',
      };

      const user = {
        id: 1,
        isConfirmed: true,
        passwordHash: 'hashedPassword',
        roles: [
          {
            id: 1,
            name: RoleEnum.USER,
          } as RoleModel,
        ],
      } as UserModel;
      userService.getOneBy = jest.fn().mockResolvedValue(user);
      hashService.compareTextAndHash = jest.fn().mockResolvedValue(true);
      const authLoginModel = {
        userId: 1,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      } as AuthLoginModel;
      authLoginService.create = jest.fn().mockResolvedValue(authLoginModel);

      const result = await authService.login(loginDto);
      expect(result).toEqual(authLoginModel);
    });
  });

  describe('register', () => {
    it('should create a user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'test',
        nickname: 'test',
      };

      const hashedEmail = 'hashedEmail';
      hashService.makeHash = jest.fn().mockResolvedValue(hashedEmail);
      hashService.makeHash = jest.fn().mockResolvedValue('hashedPassword');
      roleService.getOneBy = jest
        .fn()
        .mockResolvedValue({ name: RoleEnum.USER });
      userService.create = jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'test',
        nickname: 'test',
      });

      const result = await authService.register(registerDto);
      expect(result.email).toBe('test@example.com');
      expect(hashService.makeHash).toHaveBeenCalled();
      expect(roleService.getOneBy).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should call AuthLoginService.refresh', async () => {
      const refreshDto: RefreshDto = {
        loginId: 'uuid',
        refreshToken: 'refreshToken',
      };
      await authService.refresh(refreshDto);
      expect(authLoginService.refresh).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call AuthLoginService.logout', async () => {
      const logoutDto: LogoutDto = {
        loginId: 'uuid',
      };
      const contextDto: ContextDto = {
        email: 'test@test.com',
        userId: 1,
        roles: ['user'],
      };
      await authService.logout(logoutDto, contextDto);
      expect(authLoginService.logout).toHaveBeenCalled();
    });
  });
});
