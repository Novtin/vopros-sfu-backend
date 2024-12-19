import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../modules/auth/domain/services/auth.service';
import { UserService } from '../../modules/user/domain/services/user.service';
import { TokenService } from '../../modules/auth/domain/services/token.service';
import { HashService } from '../../modules/auth/domain/services/hash.service';
import { RoleService } from '../../modules/user/domain/services/role.service';
import { LoginDto } from '../../modules/auth/domain/dtos/login.dto';
import { UserModel } from '../../modules/user/domain/models/user.model';
import { describe, expect, it, beforeAll } from '@jest/globals';
import { RoleEnum } from '../../modules/user/domain/enum/role.enum';
import { JwtDto } from '../../modules/auth/domain/dtos/jwt.dto';
import { RegisterDto } from '../../modules/auth/domain/dtos/register.dto';
import { RefreshJwtDto } from '../../modules/auth/domain/dtos/refresh-jwt.dto';
import { IJwtPayload } from '../../modules/auth/domain/interfaces/i-jwt-payload-interface';
import { RoleModel } from '../../modules/user/domain/models/role.model';
import { IEventEmitterService } from '../../modules/global/domain/interfaces/i-event-emitter-service';
import { IConfigService } from '../../modules/global/domain/interfaces/i-config-service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let tokenService: TokenService;
  let hashService: HashService;
  let roleService: RoleService;
  let configService: IConfigService;
  let eventEmitterService: IEventEmitterService;

  beforeAll(async () => {
    const mockUserService = {
      getOneBy: jest.fn(),
      create: jest.fn(),
      confirmEmail: jest.fn(),
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

    const mockConfigService = {
      get: jest.fn(),
    };

    const mockEventEmitterService = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: HashService, useValue: mockHashService },
        { provide: RoleService, useValue: mockRoleService },
        { provide: IEventEmitterService, useValue: mockEventEmitterService },
        { provide: IConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    tokenService = module.get<TokenService>(TokenService);
    hashService = module.get<HashService>(HashService);
    roleService = module.get<RoleService>(RoleService);
    eventEmitterService =
      module.get<IEventEmitterService>(IEventEmitterService);
    configService = module.get<IConfigService>(IConfigService);
  });

  describe('login', () => {
    it('should throw ForbiddenException if user is not confirmed', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
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
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
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

    it('should return JwtDto if login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
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
      const jwtDto: JwtDto = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      tokenService.make = jest.fn().mockResolvedValue(jwtDto);

      const result = await authService.login(loginDto);
      expect(result).toEqual(jwtDto);
    });
  });

  describe('register', () => {
    it('should create a user and send a confirmation email', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'test',
        nickname: 'test',
        description: 'Test',
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
        description: 'Test',
        emailHash: 'hashedEmail',
      });
      configService.get = jest.fn().mockReturnValue('http://test.com');

      const result = await authService.register(registerDto);
      expect(result.email).toBe('test@example.com');
      expect(eventEmitterService.emit).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const refreshDto: RefreshJwtDto = { refreshToken: 'refreshToken' };
      tokenService.verify = jest.fn().mockResolvedValue(null);

      await expect(authService.refresh(refreshDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should return new JWT tokens if refresh token is valid', async () => {
      const refreshDto: RefreshJwtDto = { refreshToken: 'refreshToken' };
      const payload: IJwtPayload = {
        email: 'test@example.com',
        userId: 1,
        roles: [RoleEnum.USER],
      };
      const jwtDto: JwtDto = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };

      tokenService.verify = jest.fn().mockResolvedValue(payload);
      tokenService.make = jest.fn().mockResolvedValue(jwtDto);

      const result = await authService.refresh(refreshDto);
      expect(result).toEqual(jwtDto);
    });
  });
});
