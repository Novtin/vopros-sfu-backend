import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../global/infrastructure/interceptors/transform.interceptor';
import { UserModel } from '../../../user/domain/models/user.model';
import { RegisterDto } from '../../domain/dtos/register.dto';
import { UserSchema } from '../../../user/infrastructure/schemas/user.schema';
import { JwtDto } from '../../domain/dtos/jwt.dto';
import { AuthService } from '../../domain/services/auth.service';
import { LoginDto } from '../../domain/dtos/login.dto';
import { RefreshJwtDto } from '../../domain/dtos/refresh-jwt.dto';
import { ConfirmEmailDto } from '../../domain/dtos/confirm-email.dto';
import { JwtSchema } from '../schemas/jwt.schema';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: JwtSchema,
  })
  @ApiOperation({ summary: 'Войти' })
  @UseInterceptors(new TransformInterceptor(JwtSchema))
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<JwtDto> {
    return this.authService.login(loginDto);
  }

  @ApiOkResponse({
    type: UserSchema,
  })
  @ApiOperation({ summary: 'Зарегистрироваться' })
  @UseInterceptors(new TransformInterceptor(UserSchema))
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<UserModel> {
    return this.authService.register(registerDto);
  }

  @ApiOkResponse({
    type: Boolean,
  })
  @ApiOperation({ summary: 'Подтвердить электронную почту после регистрации' })
  @Post('confirm-email')
  confirmEmail(@Body() dto: ConfirmEmailDto) {
    return this.authService.confirmEmail(dto.emailHash);
  }

  @ApiOkResponse({
    type: JwtSchema,
  })
  @ApiOperation({ summary: 'Обновить JWT' })
  @UseInterceptors(new TransformInterceptor(JwtSchema))
  @Post('refresh')
  refresh(@Body() refreshDto: RefreshJwtDto): Promise<JwtDto> {
    return this.authService.refresh(refreshDto);
  }
}
