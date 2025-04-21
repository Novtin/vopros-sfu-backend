import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Authorized } from '../../../auth/infrastructure/decorators/Authorized';
import { NotificationService } from '../../domain/services/NotificationService';
import { NotificationModel } from '../../domain/models/NotificationModel';
import { NotificationSearchDto } from '../../domain/dtos/NotificationSearchDto';
import { NotificationSchema } from '../schemas/NotificationSchema';
import { SchemaTransform } from '../../../global/infrastructure/decorators/SchemaTransform';
import { NotificationSendFeedbackDto } from '../../domain/dtos/NotificationSendFeedbackDto';
import { OptionalAuthorized } from '../../../auth/infrastructure/decorators/OptionalAuthorized';
import { Context } from '../../../auth/infrastructure/decorators/Context';
import { ContextDto } from '../../../auth/domain/dtos/ContextDto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerImageOptions } from '../../../../config/MulterImageConfig';

@ApiTags('Уведомления')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Authorized()
  @ApiOperation({ summary: 'Получить уведомления' })
  @SchemaTransform(NotificationSchema, { isPagination: true })
  @Get()
  search(
    @Query() dto: NotificationSearchDto,
  ): Promise<[NotificationModel[], number]> {
    return this.notificationService.search(dto);
  }

  @OptionalAuthorized()
  @UseInterceptors(FilesInterceptor('imageFiles', 5, multerImageOptions))
  @ApiOkResponse()
  @ApiOperation({ summary: 'Отправить обратную связь' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Заголовок' },
        text: { type: 'string', example: 'Текст отзыва' },
        email: { type: 'string', example: 'user@example.com' },
        imageFiles: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['title', 'text', 'email'],
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/feedback')
  sendFeedback(
    @Body() dto: NotificationSendFeedbackDto,
    @UploadedFiles() imageFiles: Express.Multer.File[],
    @Context() context: ContextDto,
  ) {
    if (context?.email) {
      dto.email = context.email;
    }
    return this.notificationService.sendFeedback(dto, imageFiles);
  }
}
