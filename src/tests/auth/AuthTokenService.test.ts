import { describe, expect, it, beforeAll } from '@jest/globals';
import { AuthTokenService } from '../../modules/auth/domain/services/AuthTokenService';
import { TestingModule } from '@nestjs/testing';
import { IJwtPayload } from '../../modules/auth/domain/interfaces/IJwtPayloadInterface';
import { RoleEnum } from '../../modules/user/domain/enums/RoleEnum';
import { JwtDto } from '../../modules/auth/domain/dtos/JwtDto';
import { JwtEnum } from '../../modules/auth/domain/enums/JwtEnum';
import { UnauthorizedException } from '../../modules/global/domain/exceptions/UnauthorizedException';
import { getTestModule } from '../utils';

describe('AuthTokenService', () => {
  let tokenService: AuthTokenService;

  const payload: IJwtPayload = {
    email: 'test@example.com',
    userId: 1,
    roles: [RoleEnum.USER],
  };

  beforeAll(async () => {
    const module: TestingModule = await getTestModule();

    tokenService = module.get<AuthTokenService>(AuthTokenService);
  });

  describe('makeTokens', () => {
    it('should return access and refresh tokens', async () => {
      const tokens: JwtDto = await tokenService.make(payload);
      expect(tokens.accessToken.length).toBeGreaterThan(0);
      expect(tokens.refreshToken.length).toBeGreaterThan(0);
    });
  });

  describe('verify', () => {
    it('should return decoded payload for valid token', async () => {
      const tokens: JwtDto = await tokenService.make(payload);

      const verifyAccess = await tokenService.verify(
        tokens.accessToken,
        JwtEnum.ACCESS,
      );
      expect(verifyAccess).toMatchObject(payload as Record<string, any>);

      const verifyRefresh = await tokenService.verify(
        tokens.refreshToken,
        JwtEnum.REFRESH,
      );
      expect(verifyRefresh).toMatchObject(payload as Record<string, any>);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const token = 'invalidToken';

      await expect(
        tokenService.verify(token, JwtEnum.ACCESS),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
