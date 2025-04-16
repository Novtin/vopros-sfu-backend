import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorized } from '../../../auth/infrastructure/decorators/Authorized';
import { NotificationService } from '../../domain/services/NotificationService';
import { NotificationModel } from '../../domain/models/NotificationModel';
import { NotificationSearchDto } from '../../domain/dtos/NotificationSearchDto';
import { NotificationSchema } from '../schemas/NotificationSchema';
import { SchemaTransform } from '../../../global/infrastructure/decorators/SchemaTransform';

@Authorized()
@ApiTags('Уведомления')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Получить уведомления' })
  @SchemaTransform(NotificationSchema, { isPagination: true })
  @Get()
  search(
    @Query() dto: NotificationSearchDto,
  ): Promise<[NotificationModel[], number]> {
    return this.notificationService.search(dto);
  }
}
