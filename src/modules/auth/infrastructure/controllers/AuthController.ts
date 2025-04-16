import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserModel } from '../../../user/domain/models/UserModel';
import { AuthRegisterDto } from '../../domain/dtos/AuthRegisterDto';
import { UserSchema } from '../../../user/infrastructure/schemas/UserSchema';
import { AuthService } from '../../domain/services/AuthService';
import { AuthLoginDto } from '../../domain/dtos/AuthLoginDto';
import { AuthRefreshDto } from '../../domain/dtos/AuthRefreshDto';
import { AuthLoginSchema } from '../schemas/AuthLoginSchema';
import { SchemaTransform } from '../../../global/infrastructure/decorators/SchemaTransform';
import { AuthLogoutDto } from '../../domain/dtos/AuthLogoutDto';
import { Request } from 'express';
import { getIpAddress } from '../../../global/infrastructure/helpers/getIpAddress';
import { Authorized } from '../decorators/Authorized';
import { Context } from '../decorators/Context';
import { ContextDto } from '../../domain/dtos/ContextDto';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Войти' })
  @SchemaTransform(AuthLoginSchema)
  @Post('login')
  login(@Body() dto: AuthLoginDto, @Req() request: Request) {
    return this.authService.login({
      ...dto,
      ipAddress: getIpAddress(request),
    });
  }

  @ApiOperation({ summary: 'Зарегистрироваться' })
  @SchemaTransform(UserSchema)
  @Post('register')
  register(@Body() dto: AuthRegisterDto): Promise<UserModel> {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Обновить JWT' })
  @SchemaTransform(AuthLoginSchema)
  @Post('refresh')
  refresh(@Body() dto: AuthRefreshDto) {
    return this.authService.refresh(dto);
  }

  @Authorized()
  @ApiOperation({ summary: 'Выйти' })
  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@Body() dto: AuthLogoutDto, @Context() context: ContextDto) {
    return this.authService.logout(dto, context);
  }
}
