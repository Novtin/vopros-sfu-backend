import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../../domain/interfaces/i-jwt-payload-interface';
import { UserService } from '../../../user/domain/services/user.service';
import { IConfigService } from '../../../global/domain/interfaces/i-config-service';

export const JWT_STRATEGY = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(
    private readonly userService: UserService,
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
    const isUserExists = await this.userService.existBy({
      email: payload.email,
    });
    if (!isUserExists) {
      throw new UnauthorizedException('Пользователя с таким email нет');
    }

    return payload;
  }
}
