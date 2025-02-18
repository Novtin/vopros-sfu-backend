import { Inject, Injectable } from '@nestjs/common';
import { AuthTokenService } from './auth-token.service';
import { UserModel } from '../../../user/domain/models/user.model';
import { IAuthLoginRepository } from '../interfaces/i-auth-login.repository';
import { TokenEnum } from '../enums/token.enum';
import { UnauthorizedException } from '../../../global/domain/exceptions/unauthorized.exception';
import { RefreshDto } from '../dtos/refresh.dto';
import { LogoutDto } from '../dtos/logout.dto';
import { AuthLoginModel } from '../models/auth-login.model';
import { BadRequestException } from '../../../global/domain/exceptions/bad-request.exception';

@Injectable()
export class AuthLoginService {
  constructor(
    private readonly tokenService: AuthTokenService,
    @Inject(IAuthLoginRepository)
    private readonly authLoginRepository: IAuthLoginRepository,
  ) {}

  async create(user: UserModel, ipAddress: string) {
    const { accessToken, refreshToken } = await this.tokenService.make({
      userId: user.id,
      email: user.email,
      roles: user.roles.map((role) => role.name),
    });

    return this.authLoginRepository.save({
      userId: user.id,
      accessToken,
      refreshToken,
      ipAddress,
    });
  }

  async refresh(dto: RefreshDto) {
    const loginModel = await this.getOneBy({
      refreshToken: dto.refreshToken,
      id: dto.loginId,
    });

    const payloadFromToken = await this.tokenService.verify(
      loginModel.refreshToken,
      TokenEnum.REFRESH,
    );
    if (!payloadFromToken) {
      throw new UnauthorizedException('JWT истёк');
    }

    const { accessToken, refreshToken } = await this.tokenService.make({
      email: payloadFromToken.email,
      userId: payloadFromToken.userId,
      roles: payloadFromToken.roles,
    });

    return this.authLoginRepository.save({
      id: loginModel.id,
      accessToken,
      refreshToken,
    });
  }

  async logout(dto: LogoutDto, userId: number) {
    const loginModel = await this.getOneBy({
      id: dto.loginId,
      userId,
    });

    await this.authLoginRepository.save({
      id: loginModel.id,
      isLogout: true,
    });
  }

  async getOneBy(dto: Partial<AuthLoginModel>) {
    const loginModel = await this.authLoginRepository.getOneBy(dto);
    if (!loginModel || loginModel.isLogout) {
      throw new BadRequestException('Данная авторизация не доступна');
    }
    return loginModel;
  }
}
