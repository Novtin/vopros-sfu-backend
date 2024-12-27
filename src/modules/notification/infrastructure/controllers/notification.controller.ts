import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorized } from '../../../auth/infrastructure/decorators/authorized.decorator';
import { NotificationService } from '../../domain/services/notification.service';
import { TransformInterceptor } from '../../../global/infrastructure/interceptors/transform.interceptor';
import { NotificationModel } from '../../domain/models/notification.model';
import { SearchNotificationDto } from '../../domain/dtos/search-notification.dto';
import { NotificationSchema } from '../schemas/notification.schema';
import { ApiOkPagination } from '../../../global/infrastructure/decorators/api-ok-pagination';

@Authorized()
@ApiTags('Уведомления')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOkPagination({ type: NotificationSchema })
  @ApiOperation({ summary: 'Получить уведомления' })
  @UseInterceptors(new TransformInterceptor(NotificationSchema))
  @Get()
  search(
    @Query() dto: SearchNotificationDto,
  ): Promise<[NotificationModel[], number]> {
    return this.notificationService.search(dto);
  }
}
