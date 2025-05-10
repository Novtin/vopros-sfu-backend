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
import { QuestionSchema } from '../schemas/QuestionSchema';
import { Context } from '../../../auth/infrastructure/decorators/Context';
import { ContextDto } from '../../../auth/domain/dtos/ContextDto';
import { Authorized } from '../../../auth/infrastructure/decorators/Authorized';
import { RatingDto } from '../../../global/domain/dtos/RatingDto';
import { SchemaTransform } from '../../../global/infrastructure/decorators/SchemaTransform';
import { QuestionRatingService } from '../../domain/services/QuestionRatingService';

@Authorized()
@ApiTags('Вопрос')
@Controller('question')
export class QuestionRatingController {
  constructor(private readonly questionRatingService: QuestionRatingService) {}

  @ApiOperation({ summary: 'Оценить вопрос' })
  @SchemaTransform(QuestionSchema)
  @Post('/:id/rate')
  setRating(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RatingDto,
    @Context() context: ContextDto,
  ) {
    return this.questionRatingService.setRating({
      questionId: id,
      userId: context.userId,
      value: dto.value,
    });
  }

  @ApiOkResponse()
  @ApiOperation({ summary: 'Убрать оценку вопроса' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id/rate')
  deleteRating(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RatingDto,
    @Context() context: ContextDto,
  ) {
    return this.questionRatingService.deleteRating({
      questionId: id,
      userId: context.userId,
      value: dto.value,
    });
  }
}
