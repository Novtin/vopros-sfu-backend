import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../../user/domain/services/user.service';
import { UserModel } from '../../../user/domain/models/user.model';
import { RegisterDto } from '../dtos/register.dto';
import { RefreshDto } from '../dtos/refresh.dto';
import { RoleService } from '../../../user/domain/services/role.service';
import { RoleEnum } from '../../../user/domain/enums/role.enum';
import { ForbiddenException } from '../../../global/domain/exceptions/forbidden.exception';
import { UnauthorizedException } from '../../../global/domain/exceptions/unauthorized.exception';
import { IHashService } from '../interfaces/i-hash-service';
import { AuthLoginService } from './auth-login.service';
import { AuthLoginModel } from '../models/auth-login.model';
import { LogoutDto } from '../dtos/logout.dto';
import { IAuthLogin } from '../interfaces/i-auth-login';
import { ContextDto } from '../dtos/context.dto';

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

  async register(registerDto: RegisterDto): Promise<UserModel> {
    return this.userService.create({
      ...registerDto,
      passwordHash: await this.hashService.makeHash(registerDto.password),
      roles: [await this.roleService.getOneBy({ name: RoleEnum.USER })],
    });
  }

  async refresh(dto: RefreshDto) {
    return this.authLoginService.refresh(dto);
  }

  async logout(dto: LogoutDto, context: ContextDto) {
    return this.authLoginService.logout(dto, context.userId);
  }
}
