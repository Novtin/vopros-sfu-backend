import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../../user/domain/services/UserService';
import { UserModel } from '../../../user/domain/models/UserModel';
import { AuthRegisterDto } from '../dtos/AuthRegisterDto';
import { AuthRefreshDto } from '../dtos/AuthRefreshDto';
import { RoleService } from '../../../user/domain/services/RoleService';
import { RoleEnum } from '../../../user/domain/enums/RoleEnum';
import { ForbiddenException } from '../../../global/domain/exceptions/ForbiddenException';
import { UnauthorizedException } from '../../../global/domain/exceptions/UnauthorizedException';
import { IHashService } from '../interfaces/IHashService';
import { AuthLoginService } from './AuthLoginService';
import { AuthLoginModel } from '../models/AuthLoginModel';
import { AuthLogoutDto } from '../dtos/AuthLogoutDto';
import { IAuthLogin } from '../interfaces/IAuthLogin';
import { ContextDto } from '../dtos/ContextDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    @Inject(IHashService)
    private readonly hashService: IHashService,
    private readonly authLoginService: AuthLoginService,
  ) {}

  async login(loginDto: IAuthLogin): Promise<AuthLoginModel> {
    const user: UserModel = await this.userService.getOneBy({
      email: loginDto.email,
    });
    if (!user.isConfirmed) {
      throw new ForbiddenException('Аккаунт не подтвержден');
    }
    const isPasswordValid: boolean = await this.hashService.compareTextAndHash(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return this.authLoginService.create(user, loginDto.ipAddress);
  }

  async register(registerDto: AuthRegisterDto): Promise<UserModel> {
    return this.userService.create({
      ...registerDto,
      passwordHash: await this.hashService.makeHash(registerDto.password),
      roles: [await this.roleService.getOneBy({ name: RoleEnum.USER })],
    });
  }

  async refresh(dto: AuthRefreshDto) {
    return this.authLoginService.refresh(dto);
  }

  async logout(dto: AuthLogoutDto, context: ContextDto) {
    return this.authLoginService.logout(dto, context.userId);
  }
}
