import { describe, expect, it, beforeAll } from '@jest/globals';
import { AuthTokenService } from '../../../modules/auth/domain/services/auth-token.service';
import { Test, TestingModule } from '@nestjs/testing';
import { IJwtPayload } from '../../../modules/auth/domain/interfaces/i-jwt-payload-interface';
import { RoleEnum } from '../../../modules/user/domain/enums/role.enum';
import { JwtDto } from '../../../modules/auth/domain/dtos/jwt.dto';
import { TokenEnum } from '../../../modules/auth/domain/enums/token.enum';
import { UnauthorizedException } from '../../../modules/global/domain/exceptions/unauthorized.exception';
import { TestAppModule } from '../../test.app.module';

describe('AuthTokenService', () => {
  let tokenService: AuthTokenService;

  const payload: IJwtPayload = {
    email: 'test@example.com',
    userId: 1,
    roles: [RoleEnum.USER],
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

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
        TokenEnum.ACCESS,
      );
      expect(verifyAccess).toMatchObject(payload as Record<string, any>);

      const verifyRefresh = await tokenService.verify(
        tokens.refreshToken,
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
