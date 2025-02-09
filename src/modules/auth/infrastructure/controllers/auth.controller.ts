import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserModel } from '../../../user/domain/models/user.model';
import { RegisterDto } from '../../domain/dtos/register.dto';
import { UserSchema } from '../../../user/infrastructure/schemas/user.schema';
import { JwtDto } from '../../domain/dtos/jwt.dto';
import { AuthService } from '../../domain/services/auth.service';
import { LoginDto } from '../../domain/dtos/login.dto';
import { RefreshJwtDto } from '../../domain/dtos/refresh-jwt.dto';
import { JwtSchema } from '../schemas/jwt.schema';
import { SchemaTransform } from '../../../global/infrastructure/decorators/schema-transform';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Войти' })
  @SchemaTransform(JwtSchema)
  @Post('login')
  login(@Body() dto: LoginDto): Promise<JwtDto> {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Зарегистрироваться' })
  @SchemaTransform(UserSchema)
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<UserModel> {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Обновить JWT' })
  @SchemaTransform(JwtSchema)
  @Post('refresh')
  refresh(@Body() refreshDto: RefreshJwtDto): Promise<JwtDto> {
    return this.authService.refresh(refreshDto);
  }
}
