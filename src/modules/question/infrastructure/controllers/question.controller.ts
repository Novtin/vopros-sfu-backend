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
import { QuestionCountSchema } from '../schemas/question-count.schema';
import { IQuestionCount } from '../../domain/interfaces/i-question-count';
import { SchemaTransform } from '../../../global/infrastructure/decorators/schema-transform';
import { OptionalAuthorized } from '../../../auth/infrastructure/decorators/optional-authorized';

@ApiTags('Вопрос')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Authorized()
  @ApiOperation({ summary: 'Создать вопрос' })
  @SchemaTransform(QuestionSchema)
  @Post()
  create(
    @Body() dto: SaveQuestionDto,
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
    @Body() dto: UpdateQuestionDto,
    @Context() context: ContextDto,
  ): Promise<QuestionModel> {
    return this.questionService.update(context.userId, id, dto);
  }

  @ApiOperation({ summary: 'Получить вопросы' })
  @SchemaTransform(QuestionSchema, { isPagination: true })
  @Get()
  search(@Query() dto: SearchQuestionDto) {
    return this.questionService.search(dto);
  }

  @SchemaTransform(QuestionCountSchema)
  @ApiOperation({ summary: 'Получить количество вопросов' })
  @Get('/count')
  getCountQuestions(): Promise<IQuestionCount> {
    return this.questionService.getCountQuestions();
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

  @Authorized()
  @ApiOperation({ summary: 'Оценить вопрос' })
  @SchemaTransform(QuestionSchema)
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

  @Authorized()
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

  @Authorized()
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

  @Authorized()
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
