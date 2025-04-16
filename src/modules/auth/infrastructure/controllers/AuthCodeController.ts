import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SchemaTransform } from '../../../global/infrastructure/decorators/SchemaTransform';
import { AuthCodeService } from '../../domain/services/AuthCodeService';
import { AuthCodeCreateOrUpdateDto } from '../../domain/dtos/AuthCodeCreateOrUpdateDto';
import { AuthCodeModel } from '../../domain/models/AuthCodeModel';
import { AuthCodeSchema } from '../schemas/AuthCodeSchema';
import { AuthCodeConfirmDto } from '../../domain/dtos/AuthCodeConfirmDto';
import { AuthCodeConfirmSchema } from '../schemas/AuthCodeConfirmSchema';

@ApiTags('Код подтверждения')
@Controller('auth-code')
export class AuthCodeController {
  constructor(private readonly authCodeService: AuthCodeService) {}

  @ApiOperation({ summary: 'Подтвердить код' })
  @SchemaTransform(AuthCodeConfirmSchema)
  @Post('confirm')
  confirm(@Body() dto: AuthCodeConfirmDto) {
    return this.authCodeService.confirm(dto);
  }

  @ApiOperation({ summary: 'Создать или обновить код' })
  @SchemaTransform(AuthCodeSchema)
  @Post()
  createOrUpdate(
    @Body() dto: AuthCodeCreateOrUpdateDto,
  ): Promise<AuthCodeModel> {
    return this.authCodeService.createOrUpdate(dto);
  }
}
