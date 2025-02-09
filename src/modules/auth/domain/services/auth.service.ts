import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../../user/domain/services/user.service';
import { TokenService } from './token.service';
import { JwtDto } from '../dtos/jwt.dto';
import { UserModel } from '../../../user/domain/models/user.model';
import { LoginDto } from '../dtos/login.dto';
import { IJwtPayload } from '../interfaces/i-jwt-payload-interface';
import { RegisterDto } from '../dtos/register.dto';
import { RefreshJwtDto } from '../dtos/refresh-jwt.dto';
import { RoleService } from '../../../user/domain/services/role.service';
import { RoleEnum } from '../../../user/domain/enum/role.enum';
import { TokenEnum } from '../enums/token.enum';
import { IEventEmitterService } from '../../../global/domain/interfaces/i-event-emitter-service';
import { ForbiddenException } from '../../../global/domain/exceptions/forbidden.exception';
import { UnauthorizedException } from '../../../global/domain/exceptions/unauthorized.exception';
import { IHashService } from '../interfaces/i-hash-service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IEventEmitterService)
    private readonly eventEmitterService: IEventEmitterService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    @Inject(IHashService)
    private readonly hashService: IHashService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto): Promise<JwtDto> {
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

    return await this.tokenService.make({
      email: user.email,
      userId: user.id,
      roles: user.roles.map((role) => role.name),
    });
  }

  async register(registerDto: RegisterDto): Promise<UserModel> {
    return this.userService.create({
      ...registerDto,
      passwordHash: await this.hashService.makeHash(registerDto.password),
      roles: [await this.roleService.getOneBy({ name: RoleEnum.USER })],
    });
  }

  async refresh(refreshDto: RefreshJwtDto): Promise<JwtDto> {
    const payloadFromToken = await this.tokenService.verify(
      refreshDto.refreshToken,
      TokenEnum.REFRESH,
    );
    if (!payloadFromToken) {
      throw new UnauthorizedException('JWT истёк');
    }
    const newPayload: IJwtPayload = {
      email: payloadFromToken.email,
      userId: payloadFromToken.userId,
      roles: payloadFromToken.roles,
    };
    return this.tokenService.make(newPayload);
  }
}
