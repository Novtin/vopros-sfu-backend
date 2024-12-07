import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtDto } from '../dtos/jwt.dto';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '../interfaces/jwt.payload.interface';
import { TokenEnum } from '../enums/token.enum';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async makeTokens(payload: IJwtPayload): Promise<JwtDto> {
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
    let payload: IJwtPayload = null;
    try {
      const secret =
        type === TokenEnum.ACCESS
          ? this.configService.get('jwt.accessSecret')
          : this.configService.get('jwt.refreshSecret');
      payload = this.jwtService.verify(token, {
        secret,
        algorithms: this.configService.get('jwt.algorithm'),
      });
    } catch {
      throw new UnauthorizedException('JWT has expired');
    }
    return payload;
  }
}
