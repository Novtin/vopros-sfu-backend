import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../../domain/interfaces/IJwtPayloadInterface';
import { IConfigService } from '../../../global/domain/interfaces/IConfigService';
import { AuthLoginService } from '../../domain/services/AuthLoginService';

export const JWT_STRATEGY = 'jwt';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
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
