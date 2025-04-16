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
import { Authorized } from '../../../auth/infrastructure/decorators/Authorized';
import { Context } from '../../../auth/infrastructure/decorators/Context';
import { ContextDto } from '../../../auth/domain/dtos/ContextDto';
import { AnswerSaveDto } from '../../domain/dtos/AnswerSaveDto';
import { AnswerDetailSchema } from '../schemas/AnswerDetailSchema';
import { AnswerSearchDto } from '../../domain/dtos/AnswerSearchDto';
import { AnswerSchema } from '../schemas/AnswerSchema';
import { AnswerUpdateDto } from '../../domain/dtos/AnswerUpdateDto';
import { QuestionResolveDto } from '../../../question/domain/dtos/QuestionResolveDto';
import { RatingDto } from '../../../global/domain/dtos/RatingDto';
import { SchemaTransform } from '../../../global/infrastructure/decorators/SchemaTransform';
import { AnswerService } from '../../domain/services/AnswerService';
import { AnswerModel } from '../../domain/models/AnswerModel';

@ApiTags('Ответ')
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Authorized()
  @ApiOperation({ summary: 'Создать ответ' })
  @SchemaTransform(AnswerDetailSchema)
  @Post()
  create(
    @Body() dto: AnswerSaveDto,
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
  search(@Query() dto: AnswerSearchDto): Promise<[AnswerModel[], number]> {
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
    @Body() dto: AnswerUpdateDto,
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
    @Body() dto: QuestionResolveDto,
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
