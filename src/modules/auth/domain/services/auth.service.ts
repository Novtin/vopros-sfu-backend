import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../../user/domain/services/user.service';
import { TokenService } from './token.service';
import { JwtDto } from '../dtos/jwt.dto';
import { UserModel } from '../../../user/domain/models/user.model';
import { LoginDto } from '../dtos/login.dto';
import { HashService } from './hash.service';
import { IJwtPayload } from '../interfaces/i-jwt-payload-interface';
import { RegisterDto } from '../dtos/register.dto';
import { RefreshJwtDto } from '../dtos/refresh-jwt.dto';
import { RoleService } from '../../../user/domain/services/role.service';
import { RoleEnum } from '../../../user/domain/enum/role.enum';
import { TokenEnum } from '../enums/token.enum';
import { IEventEmitterService } from '../../../global/domain/interfaces/i-event-emitter-service';
import { EventEnum } from '../../../global/domain/enums/event.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IEventEmitterService)
    private readonly eventEmitterService: IEventEmitterService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly hashService: HashService,
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
    const emailHash = await this.hashService.makeHash(registerDto.email);
    const user = await this.userService.create({
      ...registerDto,
      passwordHash: await this.hashService.makeHash(registerDto.password),
      emailHash,
      roles: [await this.roleService.getOneBy({ name: RoleEnum.USER })],
    });

    this.eventEmitterService.emit(EventEnum.REGISTER_USER, {
      email: registerDto.email,
      emailHash,
    });

    return user;
  }

  async confirmEmail(emailHash: string) {
    const user = await this.userService.getOneBy({ emailHash });
    await this.userService.confirmEmail(user.id);
    return true;
  }

  async refresh(refreshDto: RefreshJwtDto): Promise<JwtDto> {
    const payloadFromToken = await this.tokenService.verify(
      refreshDto.refreshToken,
      TokenEnum.REFRESH,
    );
    if (!payloadFromToken) {
      throw new UnauthorizedException('JWT has expired');
    }
    const newPayload: IJwtPayload = {
      email: payloadFromToken.email,
      userId: payloadFromToken.userId,
      roles: payloadFromToken.roles,
    };
    return this.tokenService.make(newPayload);
  }
}
