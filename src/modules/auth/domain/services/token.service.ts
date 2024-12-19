import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtDto } from '../dtos/jwt.dto';
import { IJwtPayload } from '../interfaces/i-jwt-payload-interface';
import { TokenEnum } from '../enums/token.enum';
import { IJwtService } from '../interfaces/i-jwt-service';
import { IConfigService } from '../../../global/domain/interfaces/i-config-service';

@Injectable()
export class TokenService {
  constructor(
    @Inject(IJwtService)
    private readonly jwtService: IJwtService,
    @Inject(IConfigService)
    private readonly configService: IConfigService,
  ) {}

  async make(payload: IJwtPayload): Promise<JwtDto> {
    const accessToken: string = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.accessSecret'),
      algorithm: this.configService.get('jwt.algorithm'),
      expiresIn: this.configService.get('jwt.accessExp'),
    });

    const refreshToken: string = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      algorithm: this.configService.get('jwt.algorithm'),
      expiresIn: this.configService.get('jwt.refreshExp'),
    });

    return { accessToken, refreshToken };
  }

  async verify(token: string, type: TokenEnum): Promise<IJwtPayload> {
    try {
      return this.jwtService.verify<IJwtPayload>(token, {
        secret:
          type === TokenEnum.ACCESS
            ? this.configService.get('jwt.accessSecret')
            : this.configService.get('jwt.refreshSecret'),
        algorithms: [this.configService.get('jwt.algorithm')],
      });
    } catch {
      throw new UnauthorizedException('JWT has expired');
    }
  }
}
