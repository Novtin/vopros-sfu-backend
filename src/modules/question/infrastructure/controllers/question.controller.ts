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
import { QuestionService } from '../../domain/services/question.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TransformInterceptor } from '../../../global/infrastructure/interceptors/transform.interceptor';
import { SaveQuestionDto } from '../../domain/dtos/save-question.dto';
import { QuestionModel } from '../../domain/models/question.model';
import { QuestionSchema } from '../schemas/question.schema';
import { UpdateQuestionDto } from '../../domain/dtos/update-question.dto';
import { SearchQuestionDto } from '../../domain/dtos/search-question.dto';
import { Context } from '../../../auth/infrastructure/decorators/context.decorator';
import { ContextDto } from '../../../auth/domain/dtos/context.dto';
import { Authorized } from '../../../auth/infrastructure/decorators/authorized.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerImageOptions } from '../../../../config/multer-image.config';
import { RatingDto } from '../../../global/domain/dtos/rating.dto';
import { ApiOkPagination } from '../../../global/infrastructure/decorators/api-ok-pagination';

@ApiTags('Вопрос')
@Authorized()
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOkResponse({
    type: QuestionSchema,
  })
  @ApiOperation({ summary: 'Создать вопрос' })
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  @Post()
  create(
    @Body() dto: SaveQuestionDto,
    @Context() context: ContextDto,
  ): Promise<QuestionModel> {
    return this.questionService.create(context.userId, dto);
  }

  @ApiOkResponse({
    type: QuestionSchema,
  })
  @ApiOperation({ summary: 'Обновить вопрос' })
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
    @Context() context: ContextDto,
  ): Promise<QuestionModel> {
    return this.questionService.update(context.userId, id, dto);
  }

  @ApiOkPagination({ type: QuestionSchema })
  @ApiOperation({ summary: 'Получить вопросы' })
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  @Get()
  search(@Query() dto: SearchQuestionDto) {
    return this.questionService.search(dto);
  }

  @ApiOkResponse({
    type: Number,
  })
  @ApiOperation({ summary: 'Получить количество вопросов' })
  @Get('/count')
  getCountQuestions(): Promise<number> {
    return this.questionService.getCountQuestions();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получить вопрос' })
  @ApiOkResponse({ type: QuestionSchema })
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  async getOneById(
    @Param('id', ParseIntPipe) id: number,
    @Context() context: ContextDto,
  ): Promise<QuestionModel> {
    return this.questionService.getOneById(id, context.userId);
  }

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
  @UseInterceptors(
    FilesInterceptor('imageFiles', 5, multerImageOptions),
    new TransformInterceptor(QuestionSchema),
  )
  @Post('/:id/images')
  async uploadImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() imageFiles: Express.Multer.File[],
    @Context() context: ContextDto,
  ) {
    return this.questionService.uploadImages(context, id, imageFiles);
  }

  @ApiOkResponse({ type: QuestionSchema })
  @ApiOperation({ summary: 'Оценить вопрос' })
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  @Post('/:id/rate')
  rate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RatingDto,
    @Context() context: ContextDto,
  ) {
    return this.questionService.rate({
      questionId: id,
      userId: context.userId,
      value: dto.value,
    });
  }

  @ApiOkResponse()
  @ApiOperation({ summary: 'Убрать оценку вопроса' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id/rate')
  deleteRate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RatingDto,
    @Context() context: ContextDto,
  ) {
    return this.questionService.deleteRate({
      questionId: id,
      userId: context.userId,
      value: dto.value,
    });
  }

  @ApiOkResponse()
  @ApiOperation({ summary: 'Добавить вопрос в избранное' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/:id/favorite')
  setFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Context() context: ContextDto,
  ) {
    return this.questionService.setFavorite({
      questionId: id,
      userId: context.userId,
    });
  }

  @ApiOkResponse()
  @ApiOperation({ summary: 'Удалить вопрос из избранного' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id/favorite')
  deleteFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Context() context: ContextDto,
  ) {
    return this.questionService.deleteFavorite({
      questionId: id,
      userId: context.userId,
    });
  }
}
