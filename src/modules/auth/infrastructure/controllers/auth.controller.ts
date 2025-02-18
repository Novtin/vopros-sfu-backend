import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserModel } from '../../../user/domain/models/user.model';
import { RegisterDto } from '../../domain/dtos/register.dto';
import { UserSchema } from '../../../user/infrastructure/schemas/user.schema';
import { AuthService } from '../../domain/services/auth.service';
import { LoginDto } from '../../domain/dtos/login.dto';
import { RefreshDto } from '../../domain/dtos/refresh.dto';
import { AuthLoginSchema } from '../schemas/auth-login.schema';
import { SchemaTransform } from '../../../global/infrastructure/decorators/schema-transform';
import { LogoutDto } from '../../domain/dtos/logout.dto';
import { Request } from 'express';
import { getIpAddress } from '../../../global/infrastructure/helpers/getIpAddress';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Войти' })
  @SchemaTransform(AuthLoginSchema)
  @Post('login')
  login(@Body() dto: LoginDto, @Req() request: Request) {
    return this.authService.login({
      ...dto,
      ipAddress: getIpAddress(request),
    });
  }

  @ApiOperation({ summary: 'Зарегистрироваться' })
  @SchemaTransform(UserSchema)
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<UserModel> {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Обновить JWT' })
  @SchemaTransform(AuthLoginSchema)
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }

  @ApiOperation({ summary: 'Войти' })
  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto);
  }
}
