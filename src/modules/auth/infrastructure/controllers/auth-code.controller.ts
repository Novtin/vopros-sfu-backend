import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SchemaTransform } from '../../../global/infrastructure/decorators/schema-transform';
import { AuthCodeService } from '../../domain/services/auth-code.service';
import { CreateOrUpdateAuthCodeDto } from '../../domain/dtos/create-or-update-auth-code.dto';
import { AuthCodeModel } from '../../domain/models/auth-code.model';
import { AuthCodeSchema } from '../schemas/auth-code.schema';
import { ConfirmAuthCodeDto } from '../../domain/dtos/confirm-auth-code.dto';
import { AuthCodeConfirmSchema } from '../schemas/auth-code-confirm.schema';

@ApiTags('Код подтверждения')
@Controller('auth-code')
export class AuthCodeController {
  constructor(private readonly authCodeService: AuthCodeService) {}

  @ApiOperation({ summary: 'Подтвердить код' })
  @SchemaTransform(AuthCodeConfirmSchema)
  @Post('confirm')
  confirm(@Body() dto: ConfirmAuthCodeDto) {
    return this.authCodeService.confirm(dto);
  }

  @ApiOperation({ summary: 'Создать или обновить код' })
  @SchemaTransform(AuthCodeSchema)
  @Post()
  createOrUpdate(
    @Body() dto: CreateOrUpdateAuthCodeDto,
  ): Promise<AuthCodeModel> {
    return this.authCodeService.createOrUpdate(dto);
  }
}
