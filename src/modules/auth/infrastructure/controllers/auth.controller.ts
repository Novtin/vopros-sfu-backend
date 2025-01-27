import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserModel } from '../../../user/domain/models/user.model';
import { RegisterDto } from '../../domain/dtos/register.dto';
import { UserSchema } from '../../../user/infrastructure/schemas/user.schema';
import { JwtDto } from '../../domain/dtos/jwt.dto';
import { AuthService } from '../../domain/services/auth.service';
import { LoginDto } from '../../domain/dtos/login.dto';
import { RefreshJwtDto } from '../../domain/dtos/refresh-jwt.dto';
import { ConfirmEmailDto } from '../../domain/dtos/confirm-email.dto';
import { JwtSchema } from '../schemas/jwt.schema';
import { Transform } from '../../../global/infrastructure/decorators/transform';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Войти' })
  @Transform(JwtSchema)
  @UseGuards()
  @Post('login')
  login(@Body() dto: LoginDto): Promise<JwtDto> {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Зарегистрироваться' })
  @Transform(UserSchema)
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<UserModel> {
    return this.authService.register(registerDto);
  }

  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Подтвердить электронную почту после регистрации' })
  @Post('confirm-email')
  confirmEmail(@Body() dto: ConfirmEmailDto): Promise<void> {
    return this.authService.confirmEmail(dto.emailHash);
  }

  @ApiOperation({ summary: 'Обновить JWT' })
  @Transform(JwtSchema)
  @Post('refresh')
  refresh(@Body() refreshDto: RefreshJwtDto): Promise<JwtDto> {
    return this.authService.refresh(refreshDto);
  }
}
