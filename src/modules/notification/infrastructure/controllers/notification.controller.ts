import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Authorized } from '../../../auth/infrastructure/decorators/authorized.decorator';
import { NotificationService } from '../../domain/services/notification.service';
import { TransformInterceptor } from '../../../../common/interceptors/transform.interceptor';
import { NotificationModel } from '../../domain/models/notification.model';
import { SearchNotificationDto } from '../../domain/dtos/search-notification.dto';
import { NotificationSchema } from '../schemas/notification.schema';

@Authorized()
@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOkResponse({
    type: NotificationSchema,
    isArray: true,
  })
  @UseInterceptors(new TransformInterceptor(NotificationSchema))
  @Get()
  search(
    @Query() dto: SearchNotificationDto,
  ): Promise<[NotificationModel[], number]> {
    return this.notificationService.search(dto);
  }
}
