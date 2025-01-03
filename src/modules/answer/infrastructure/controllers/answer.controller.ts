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
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorized } from '../../../auth/infrastructure/decorators/authorized.decorator';
import { TransformInterceptor } from '../../../global/infrastructure/interceptors/transform.interceptor';
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
import { ApiOkPagination } from '../../../global/infrastructure/decorators/api-ok-pagination';

@Authorized()
@ApiTags('Ответ')
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @ApiOkResponse({
    type: AnswerDetailSchema,
  })
  @ApiOperation({ summary: 'Создать ответ' })
  @UseInterceptors(new TransformInterceptor(AnswerDetailSchema))
  @Post()
  create(
    @Body() dto: SaveAnswerDto,
    @Context() context: ContextDto,
  ): Promise<AnswerModel> {
    return this.answerService.create(context.userId, dto);
  }

  @Get('/:id')
  @ApiOkResponse({ type: AnswerDetailSchema })
  @ApiOperation({ summary: 'Получить ответ' })
  @UseInterceptors(new TransformInterceptor(AnswerDetailSchema))
  getOneById(@Param('id', ParseIntPipe) id: number): Promise<AnswerModel> {
    return this.answerService.getOneBy({ id });
  }

  @ApiOkPagination({ type: AnswerSchema })
  @ApiOperation({ summary: 'Получить ответы' })
  @UseInterceptors(new TransformInterceptor(AnswerSchema))
  @Get()
  search(@Query() dto: SearchAnswerDto): Promise<[AnswerModel[], number]> {
    return this.answerService.search(dto);
  }

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

  @ApiOkResponse({
    type: AnswerDetailSchema,
  })
  @ApiOperation({ summary: 'Обновить ответ' })
  @UseInterceptors(new TransformInterceptor(AnswerDetailSchema))
  @Put('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAnswerDto,
    @Context() context: ContextDto,
  ): Promise<AnswerModel> {
    return this.answerService.update(context.userId, id, dto);
  }

  @Post('/resolve/:questionId')
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
  @ApiOperation({ summary: 'Убрать отметку ответа решением вопроса' })
  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteResolve(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Context() context: ContextDto,
  ) {
    return this.answerService.deleteResolveQuestion(context.userId, questionId);
  }

  @ApiOkResponse({ type: AnswerSchema })
  @UseInterceptors(new TransformInterceptor(AnswerSchema))
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
