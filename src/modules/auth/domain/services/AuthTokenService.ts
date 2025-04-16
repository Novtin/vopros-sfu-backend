import { Inject, Injectable } from '@nestjs/common';
import { JwtDto } from '../dtos/JwtDto';
import { IJwtPayload } from '../interfaces/IJwtPayloadInterface';
import { JwtEnum } from '../enums/JwtEnum';
import { IJwtService } from '../interfaces/IJwtService';
import { IConfigService } from '../../../global/domain/interfaces/IConfigService';
import { UnauthorizedException } from '../../../global/domain/exceptions/UnauthorizedException';

@Injectable()
export class AuthTokenService {
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

  async verify(token: string, type: JwtEnum): Promise<IJwtPayload> {
    try {
      return this.jwtService.verify<IJwtPayload>(token, {
        secret:
          type === JwtEnum.ACCESS
            ? this.configService.get('jwt.accessSecret')
            : this.configService.get('jwt.refreshSecret'),
        algorithms: [this.configService.get('jwt.algorithm')],
      });
    } catch {
      throw new UnauthorizedException('JWT истёк');
    }
  }
}
