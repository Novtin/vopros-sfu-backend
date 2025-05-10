import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Context } from '../../../auth/infrastructure/decorators/Context';
import { ContextDto } from '../../../auth/domain/dtos/ContextDto';
import { Authorized } from '../../../auth/infrastructure/decorators/Authorized';
import { QuestionFavoriteService } from '../../domain/services/QuestionFavoriteService';

@Authorized()
@ApiTags('Вопрос')
@Controller('question')
export class QuestionFavoriteController {
  constructor(
    private readonly questionFavoriteService: QuestionFavoriteService,
  ) {}

  @ApiOkResponse()
  @ApiOperation({ summary: 'Добавить вопрос в избранное' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/:id/favorite')
  setFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Context() context: ContextDto,
  ) {
    return this.questionFavoriteService.setFavorite({
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
    return this.questionFavoriteService.deleteFavorite({
      questionId: id,
      userId: context.userId,
    });
  }
}
