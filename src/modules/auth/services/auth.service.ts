import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { TokenService } from './token.service';
import { JwtDto } from '../dtos/jwt.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { LoginDto } from '../dtos/login.dto';
import { HashService } from './hash.service';
import { IJwtPayload } from '../interfaces/jwt.payload.interface';
import { RegisterDto } from '../dtos/register.dto';
import { RefreshJwtDto } from '../dtos/refresh-jwt.dto';
import { RoleService } from '../../user/services/role.service';
import { RoleEnum } from '../../user/enum/role.enum';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService,
  ) {}

  async login(loginDto: LoginDto): Promise<JwtDto> {
    const user: UserEntity = await this.userService.getOneBy({
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

    return await this.tokenService.makeTokens({
      email: user.email,
      userId: user.id,
      roles: user.roles.map((role) => role.name),
    });
  }

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const emailHash = await this.hashService.makeHash(registerDto.email);
    const confirmationUrl = `http://localhost:9311/api/v1/auth/confirm-email?emailHash=${emailHash}`;

    //await this.mailerService.sendMail({
    //  to: registerDto.email,
    //  subject: 'Подтверждение почты',
    //  template: './confirmation',
    //  context: {
    //    confirmationUrl,
    //  },
    //});
    return await this.userService.create({
      ...registerDto,
      passwordHash: await this.hashService.makeHash(registerDto.password),
      emailHash,
      roles: [await this.roleService.getOneBy({ name: RoleEnum.USER })],
    });
  }

  async confirmEmail(emailHash: string) {
    await this.userService.throwNotFoundExceptionIfNotExist({ emailHash });
    const user = await this.userService.getOneBy({ emailHash });
    await this.userService.confirmEmail(user.id);
    return true;
  }

  async refresh(refreshDto: RefreshJwtDto): Promise<JwtDto> {
    const payloadFromToken = await this.tokenService.verify(
      refreshDto.refreshToken,
    );
    if (!payloadFromToken) {
      throw new UnauthorizedException('JWT has expired');
    }
    const newPayload: IJwtPayload = {
      email: payloadFromToken.email,
      userId: payloadFromToken.userId,
      roles: payloadFromToken.roles,
    };
    return await this.tokenService.makeTokens(newPayload);
  }
}
