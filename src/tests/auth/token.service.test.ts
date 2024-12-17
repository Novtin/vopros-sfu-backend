import { describe, beforeEach, expect, it, beforeAll } from '@jest/globals';
import { TokenService } from '../../modules/auth/domain/services/token.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../../modules/auth/domain/interfaces/jwt.payload.interface';
import { RoleEnum } from '../../modules/user/domain/enum/role.enum';
import { JwtDto } from '../../modules/auth/domain/dtos/jwt.dto';
import { TokenEnum } from '../../modules/auth/domain/enums/token.enum';
import { UnauthorizedException } from '@nestjs/common';

describe('TokenService', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;
  let configService: ConfigService;

  let payload: IJwtPayload;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [jwtConfig],
          envFilePath: '.env',
        }),
      ],
      providers: [TokenService],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    payload = {
      email: 'test@example.com',
      userId: 1,
      roles: [RoleEnum.USER],
    };

    accessToken = await jwtService.signAsync(payload, {
      secret: configService.get('jwt.accessSecret'),
      algorithm: configService.get('jwt.algorithm'),
      expiresIn: configService.get('jwt.accessExp'),
    });

    refreshToken = await jwtService.signAsync(payload, {
      secret: configService.get('jwt.refreshSecret'),
      algorithm: configService.get('jwt.algorithm'),
      expiresIn: configService.get('jwt.refreshExp'),
    });
  });

  describe('makeTokens', () => {
    it('should return access and refresh tokens', async () => {
      const result: JwtDto = await tokenService.makeTokens(payload);
      expect(result).toEqual({ accessToken, refreshToken });
    });
  });

  describe('verify', () => {
    it('should return decoded payload for valid token', async () => {
      const verifyAccess = await tokenService.verify(
        accessToken,
        TokenEnum.ACCESS,
      );
      expect(verifyAccess).toMatchObject(payload as Record<string, any>);

      const verifyRefresh = await tokenService.verify(
        refreshToken,
        TokenEnum.REFRESH,
      );
      expect(verifyRefresh).toMatchObject(payload as Record<string, any>);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const token = 'invalidToken';

      await expect(
        tokenService.verify(token, TokenEnum.ACCESS),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
