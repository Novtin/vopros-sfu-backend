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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto): Promise<JwtDto> {
    const user: UserEntity = await this.userService.getOneBy({
      email: loginDto.email,
    });
    const isPasswordValid: boolean = await this.hashService.compareTextAndHash(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Incorrect password');
    }

    return await this.tokenService.makeTokens({
      email: user.email,
      userId: user.id,
      roles: user.roles.map((role) => role.name),
    });
  }

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    registerDto.passwordHash = await this.hashService.makeHash(
      registerDto.passwordHash,
    );
    return await this.userService.create({
      ...registerDto,
      roles: [await this.roleService.getOneBy({ name: RoleEnum.USER })],
    });
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
