import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorized } from '../../../auth/infrastructure/decorators/authorized.decorator';
import { NotificationService } from '../../domain/services/notification.service';
import { NotificationModel } from '../../domain/models/notification.model';
import { SearchNotificationDto } from '../../domain/dtos/search-notification.dto';
import { NotificationSchema } from '../schemas/notification.schema';
import { SchemaTransform } from '../../../global/infrastructure/decorators/schema-transform';

@Authorized()
@ApiTags('Уведомления')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Получить уведомления' })
  @SchemaTransform(NotificationSchema, { pagination: true })
  @Get()
  search(
    @Query() dto: SearchNotificationDto,
  ): Promise<[NotificationModel[], number]> {
    return this.notificationService.search(dto);
  }
}
