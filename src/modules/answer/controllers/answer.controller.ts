import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Authorized } from '../../auth/decorators/authorized.decorator';
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor';
import { Context } from '../../auth/decorators/context.decorator';
import { ContextDto } from '../../auth/dtos/context.dto';
import { AnswerService } from '../services/answer.service';
import { SaveAnswerDto } from '../dtos/save-answer.dto';
import { AnswerDetailSchema } from '../schemas/answer-detail.schema';
import { AnswerEntity } from '../entities/answer.entity';
import { SearchAnswerDto } from '../dtos/search-answer.dto';
import { AnswerSchema } from '../schemas/answer.schema';
import { UpdateAnswerDto } from '../dtos/update-answer.dto';
import { ResolveQuestionDto } from '../../question/dtos/resolve-question.dto';

@Authorized()
@ApiTags('answer')
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @ApiOkResponse({
    type: AnswerDetailSchema,
  })
  @UseInterceptors(new TransformInterceptor(AnswerDetailSchema))
  @Post()
  create(
    @Body() dto: SaveAnswerDto,
    @Context() context: ContextDto,
  ): Promise<AnswerEntity> {
    return this.answerService.create(context.userId, dto);
  }

  @Get('/:id')
  @ApiOkResponse({ type: AnswerDetailSchema })
  @UseInterceptors(new TransformInterceptor(AnswerDetailSchema))
  getById(@Param('id', ParseIntPipe) id: number): Promise<AnswerEntity> {
    return this.answerService.getOneBy({ id });
  }

  @ApiOkResponse({
    type: AnswerSchema,
    isArray: true,
  })
  @UseInterceptors(new TransformInterceptor(AnswerSchema))
  @Get()
  search(@Query() dto: SearchAnswerDto): Promise<AnswerEntity[]> {
    return this.answerService.search(dto);
  }

  @ApiOkResponse({ status: HttpStatus.NO_CONTENT })
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
  @UseInterceptors(new TransformInterceptor(AnswerDetailSchema))
  @Put('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAnswerDto,
    @Context() context: ContextDto,
  ): Promise<AnswerEntity> {
    return this.answerService.update(context.userId, id, dto);
  }

  @Post('/resolve/:questionId')
  @ApiOkResponse({ status: HttpStatus.NO_CONTENT })
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
  @ApiOkResponse({ status: HttpStatus.NO_CONTENT })
  deleteResolve(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Context() context: ContextDto,
  ) {
    return this.answerService.deleteResolveQuestion(context.userId, questionId);
  }
}