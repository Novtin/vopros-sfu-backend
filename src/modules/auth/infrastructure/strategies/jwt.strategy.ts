import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../../domain/interfaces/i-jwt-payload-interface';
import { IConfigService } from '../../../global/domain/interfaces/i-config-service';
import { AuthLoginService } from '../../domain/services/auth-login.service';

export const JWT_STRATEGY = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(
    private readonly authLoginService: AuthLoginService,
    @Inject(IConfigService)
    private readonly configService: IConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.accessSecret'),
    });
  }

  async validate(payload: IJwtPayload): Promise<IJwtPayload> {
    await this.authLoginService.checkLastBy({
      userId: payload.userId,
    });

    return payload;
  }
}
