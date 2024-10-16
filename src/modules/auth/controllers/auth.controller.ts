import { Controller, Post, Body, UseInterceptors, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor';
import { UserEntity } from '../../user/entities/user.entity';
import { RegisterDto } from '../dtos/register.dto';
import { UserSchema } from '../../user/schemas/user.schema';
import { JwtDto } from '../dtos/jwt.dto';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RefreshJwtDto } from '../dtos/refresh-jwt.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: JwtDto,
  })
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
  @Get('confirm-email')
  confirmEmail(@Query('emailHash') emailHash: string) {
    return this.authService.confirmEmail(emailHash);
  }

  @ApiOkResponse({
    type: JwtDto,
  })
  @Post('refresh')
  refresh(@Body() refreshDto: RefreshJwtDto): Promise<JwtDto> {
    return this.authService.refresh(refreshDto);
  }
}
