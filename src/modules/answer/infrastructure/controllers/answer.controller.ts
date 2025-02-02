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
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorized } from '../../../auth/infrastructure/decorators/authorized.decorator';
import { Context } from '../../../auth/infrastructure/decorators/context.decorator';
import { ContextDto } from '../../../auth/domain/dtos/context.dto';
import { AnswerService } from '../../domain/services/answer.service';
import { SaveAnswerDto } from '../../domain/dtos/save-answer.dto';
import { AnswerDetailSchema } from '../schemas/answer-detail.schema';
import { AnswerModel } from '../../domain/models/answer.model';
import { SearchAnswerDto } from '../../domain/dtos/search-answer.dto';
import { AnswerSchema } from '../schemas/answer.schema';
import { UpdateAnswerDto } from '../../domain/dtos/update-answer.dto';
import { ResolveQuestionDto } from '../../../question/domain/dtos/resolve-question.dto';
import { RatingDto } from '../../../global/domain/dtos/rating.dto';
import { SchemaTransform } from '../../../global/infrastructure/decorators/schema-transform';

@ApiTags('Ответ')
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Authorized()
  @ApiOperation({ summary: 'Создать ответ' })
  @SchemaTransform(AnswerDetailSchema)
  @Post()
  create(
    @Body() dto: SaveAnswerDto,
    @Context() context: ContextDto,
  ): Promise<AnswerModel> {
    return this.answerService.create(context.userId, dto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получить ответ' })
  @SchemaTransform(AnswerDetailSchema)
  getOneById(@Param('id', ParseIntPipe) id: number): Promise<AnswerModel> {
    return this.answerService.getOneBy({ id });
  }

  @ApiOperation({ summary: 'Получить ответы' })
  @SchemaTransform(AnswerSchema, { isPagination: true })
  @Get()
  search(@Query() dto: SearchAnswerDto): Promise<[AnswerModel[], number]> {
    return this.answerService.search(dto);
  }

  @Authorized()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Удалить ответ' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Context() context: ContextDto,
  ): Promise<void> {
    await this.answerService.delete(context, id);
  }

  @Authorized()
  @ApiOperation({ summary: 'Обновить ответ' })
  @SchemaTransform(AnswerDetailSchema)
  @Put('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAnswerDto,
    @Context() context: ContextDto,
  ): Promise<AnswerModel> {
    return this.answerService.update(context.userId, id, dto);
  }

  @Post('/resolve/:questionId')
  @Authorized()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Отметить ответ решением вопроса' })
  @HttpCode(HttpStatus.NO_CONTENT)
  resolve(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: ResolveQuestionDto,
    @Context() context: ContextDto,
  ) {
    return this.answerService.resolveQuestion(
      context.userId,
      questionId,
      dto.answerId,
    );
  }

  @Delete('/resolve/:questionId')
  @Authorized()
  @ApiOperation({ summary: 'Убрать отметку ответа решением вопроса' })
  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteResolve(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Context() context: ContextDto,
  ) {
    return this.answerService.deleteResolveQuestion(context.userId, questionId);
  }

  @SchemaTransform(AnswerSchema)
  @Authorized()
  @ApiOperation({ summary: 'Оценить ответ' })
  @Post('/:id/rate')
  rate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RatingDto,
    @Context() context: ContextDto,
  ) {
    return this.answerService.rate({
      answerId: id,
      userId: context.userId,
      value: dto.value,
    });
  }

  @ApiOkResponse()
  @Authorized()
  @ApiOperation({ summary: 'Убрать оценку ответа' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id/rate')
  deleteRate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RatingDto,
    @Context() context: ContextDto,
  ) {
    return this.answerService.deleteRate({
      answerId: id,
      userId: context.userId,
      value: dto.value,
    });
  }
}
