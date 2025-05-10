import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorized } from '../../../auth/infrastructure/decorators/Authorized';
import { Context } from '../../../auth/infrastructure/decorators/Context';
import { ContextDto } from '../../../auth/domain/dtos/ContextDto';
import { AnswerSchema } from '../schemas/AnswerSchema';
import { RatingDto } from '../../../global/domain/dtos/RatingDto';
import { SchemaTransform } from '../../../global/infrastructure/decorators/SchemaTransform';
import { AnswerRatingService } from '../../domain/services/AnswerRatingService';

@Authorized()
@ApiTags('Ответ')
@Controller('answer')
export class AnswerRatingController {
  constructor(private readonly answerRatingService: AnswerRatingService) {}

  @SchemaTransform(AnswerSchema)
  @ApiOperation({ summary: 'Оценить ответ' })
  @Post('/:id/rate')
  rate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RatingDto,
    @Context() context: ContextDto,
  ) {
    return this.answerRatingService.rate({
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
    return this.answerRatingService.deleteRate({
      answerId: id,
      userId: context.userId,
      value: dto.value,
    });
  }
}
