import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../../common/interceptors/transform.interceptor';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { RegisterDto } from '../../domain/dtos/register.dto';
import { UserSchema } from '../../../user/infrastructure/schemas/user.schema';
import { JwtDto } from '../../domain/dtos/jwt.dto';
import { AuthService } from '../../domain/services/auth.service';
import { LoginDto } from '../../domain/dtos/login.dto';
import { RefreshJwtDto } from '../../domain/dtos/refresh-jwt.dto';
import { ConfirmEmailDto } from '../../domain/dtos/confirm-email.dto';
import { JwtSchema } from '../schemas/jwt.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: JwtSchema,
  })
  @UseInterceptors(new TransformInterceptor(JwtSchema))
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<JwtDto> {
    return this.authService.login(loginDto);
  }

  @ApiOkResponse({
    type: UserSchema,
  })
  @UseInterceptors(new TransformInterceptor(UserSchema))
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.authService.register(registerDto);
  }

  @ApiOkResponse({
    type: Boolean,
  })
  @Post('confirm-email')
  confirmEmail(@Body() dto: ConfirmEmailDto) {
    return this.authService.confirmEmail(dto.emailHash);
  }

  @ApiOkResponse({
    type: JwtSchema,
  })
  @UseInterceptors(new TransformInterceptor(JwtSchema))
  @Post('refresh')
  refresh(@Body() refreshDto: RefreshJwtDto): Promise<JwtDto> {
    return this.authService.refresh(refreshDto);
  }
}