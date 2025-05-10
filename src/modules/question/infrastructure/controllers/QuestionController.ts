import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { QuestionService } from '../../domain/services/QuestionService';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { QuestionSaveDto } from '../../domain/dtos/QuestionSaveDto';
import { QuestionModel } from '../../domain/models/QuestionModel';
import { QuestionSchema } from '../schemas/QuestionSchema';
import { QuestionUpdateDto } from '../../domain/dtos/QuestionUpdateDto';
import { QuestionSearchDto } from '../../domain/dtos/QuestionSearchDto';
import { Context } from '../../../auth/infrastructure/decorators/Context';
import { ContextDto } from '../../../auth/domain/dtos/ContextDto';
import { Authorized } from '../../../auth/infrastructure/decorators/Authorized';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerImageOptions } from '../../../../config/MulterImageConfig';
import { QuestionCountSchema } from '../schemas/QuestionCountSchema';
import { IQuestionCount } from '../../domain/interfaces/IQuestionCount';
import { SchemaTransform } from '../../../global/infrastructure/decorators/SchemaTransform';
import { OptionalAuthorized } from '../../../auth/infrastructure/decorators/OptionalAuthorized';

@ApiTags('Вопрос')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Authorized()
  @ApiOperation({ summary: 'Создать вопрос' })
  @SchemaTransform(QuestionSchema)
  @Post()
  create(
    @Body() dto: QuestionSaveDto,
    @Context() context: ContextDto,
  ): Promise<QuestionModel> {
    return this.questionService.create(context.userId, dto);
  }

  @Authorized()
  @ApiOperation({ summary: 'Обновить вопрос' })
  @SchemaTransform(QuestionSchema)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: QuestionUpdateDto,
    @Context() context: ContextDto,
  ): Promise<QuestionModel> {
    return this.questionService.update(context.userId, id, dto);
  }

  @ApiOperation({ summary: 'Получить вопросы' })
  @SchemaTransform(QuestionSchema, { isPagination: true })
  @Get()
  search(@Query() dto: QuestionSearchDto) {
    return this.questionService.search(dto);
  }

  @SchemaTransform(QuestionCountSchema)
  @ApiOperation({ summary: 'Получить количество вопросов' })
  @Get('/count')
  getCount(): Promise<IQuestionCount> {
    return this.questionService.getCount();
  }

  @OptionalAuthorized()
  @Get('/:id')
  @ApiOperation({ summary: 'Получить вопрос' })
  @SchemaTransform(QuestionSchema)
  async getOneById(
    @Param('id', ParseIntPipe) id: number,
    @Context() context: ContextDto,
  ): Promise<QuestionModel> {
    return this.questionService.getOneById(id, context?.userId);
  }

  @Authorized()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Удалить вопрос' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Context() context: ContextDto,
  ): Promise<void> {
    await this.questionService.delete(context, id);
  }

  @Authorized()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageFiles: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Загрузить изображения к вопросу' })
  @UseInterceptors(FilesInterceptor('imageFiles', 5, multerImageOptions))
  @SchemaTransform(QuestionSchema)
  @Post('/:id/images')
  async uploadImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() imageFiles: Express.Multer.File[],
    @Context() context: ContextDto,
  ) {
    return this.questionService.uploadImages(context, id, imageFiles);
  }
}
