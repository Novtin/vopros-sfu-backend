import { Inject, Injectable } from '@nestjs/common';
import { AuthTokenService } from './AuthTokenService';
import { UserModel } from '../../../user/domain/models/UserModel';
import { IAuthLoginRepository } from '../interfaces/IAuthLoginRepository';
import { JwtEnum } from '../enums/JwtEnum';
import { UnauthorizedException } from '../../../global/domain/exceptions/UnauthorizedException';
import { AuthRefreshDto } from '../dtos/AuthRefreshDto';
import { AuthLogoutDto } from '../dtos/AuthLogoutDto';
import { AuthLoginModel } from '../models/AuthLoginModel';

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

  async refresh(dto: AuthRefreshDto) {
    const loginModel = await this.getOneBy({
      refreshToken: dto.refreshToken,
      id: dto.loginId,
    });

    const payloadFromToken = await this.tokenService.verify(
      loginModel.refreshToken,
      JwtEnum.REFRESH,
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

  async logout(dto: AuthLogoutDto, userId: number) {
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
    this.checkExistLogin(loginModel);
    return loginModel;
  }

  async checkLastBy(dto: Partial<AuthLoginModel>) {
    const loginModel = await this.authLoginRepository.getLastBy(dto);
    this.checkExistLogin(loginModel);
  }

  checkExistLogin(model: AuthLoginModel) {
    if (!model || model.isLogout) {
      throw new UnauthorizedException('Данная авторизация не доступна');
    }
  }
}
