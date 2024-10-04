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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QuestionService } from '../services/question.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor';
import { SaveQuestionDto } from '../dtos/save-question.dto';
import { QuestionEntity } from '../entities/question.entity';
import { QuestionSchema } from '../schemas/question.schema';
import { UpdateQuestionDto } from '../dtos/update-question.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RoleEnum } from '../../user/enum/role.enum';
import { RolesAuthGuard } from '../../auth/guards/roles-auth.guard';
import { SearchQuestionDto } from '../dtos/search-question.dto';
import { Context } from '../../auth/decorators/context.decorator';
import { ContextDto } from '../../auth/dtos/context.dto';

@ApiTags('question')
@ApiBearerAuth()
@Roles(...Object.values(RoleEnum))
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOkResponse({
    type: QuestionSchema,
  })
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  @Post()
  create(@Body() dto: SaveQuestionDto): Promise<QuestionEntity> {
    return this.questionService.create(dto);
  }

  @ApiOkResponse({
    type: QuestionSchema,
  })
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
    @Context() context: ContextDto,
  ): Promise<QuestionEntity> {
    await this.questionService.throwNotFoundExceptionIfNotExist({ id });
    await this.questionService.throwForbiddenExceptionIfNotBelong(
      context.id,
      id,
    );
    return this.questionService.update(id, dto);
  }

  @Get('/:id')
  @ApiOkResponse({ type: QuestionSchema })
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  getById(@Param('id', ParseIntPipe) id: number): Promise<QuestionEntity> {
    return this.questionService.getOneBy({ id });
  }

  @ApiOkResponse({
    type: QuestionSchema,
    isArray: true,
  })
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  @Get()
  search(@Query() dto: SearchQuestionDto): Promise<QuestionEntity[]> {
    return this.questionService.search(dto);
  }

  @ApiOkResponse({ status: HttpStatus.NO_CONTENT })
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Context() context: ContextDto,
  ): Promise<void> {
    if (!context.roles.includes(RoleEnum.ADMIN)) {
      await this.questionService.throwForbiddenExceptionIfNotBelong(
        context.id,
        id,
      );
    }
    await this.questionService.delete(id);
  }
}
