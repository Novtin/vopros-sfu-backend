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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { QuestionService } from '../services/question.service';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor';
import { SaveQuestionDto } from '../dtos/save-question.dto';
import { QuestionEntity } from '../entities/question.entity';
import { QuestionSchema } from '../schemas/question.schema';
import { UpdateQuestionDto } from '../dtos/update-question.dto';
import { SearchQuestionDto } from '../dtos/search-question.dto';
import { Context } from '../../auth/decorators/context.decorator';
import { ContextDto } from '../../auth/dtos/context.dto';
import { Authorized } from '../../auth/decorators/authorized.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerImageOptions } from '../../../config/multer-image.config';
import { RateDto } from '../../../common/dtos/rate.dto';

@ApiTags('question')
@Authorized()
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOkResponse({
    type: QuestionSchema,
  })
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  @Post()
  create(
    @Body() dto: SaveQuestionDto,
    @Context() context: ContextDto,
  ): Promise<QuestionEntity> {
    return this.questionService.create(context.userId, dto);
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
    return this.questionService.update(context.userId, id, dto);
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

  @Get('/:id')
  @ApiOkResponse({ type: QuestionSchema })
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  async getOneById(
    @Param('id', ParseIntPipe) id: number,
    @Context() context: ContextDto,
  ): Promise<QuestionEntity> {
    await this.questionService.addView({
      userId: context.userId,
      questionId: id,
    });
    return this.questionService.getOneBy({ id });
  }

  @ApiOkResponse({ status: HttpStatus.NO_CONTENT })
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
      properties: {
        imageFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
  @UseInterceptors(new TransformInterceptor(QuestionSchema))
  @Post('/:id/rate')
  rate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RateDto,
    @Context() context: ContextDto,
  ) {
    return this.questionService.rate({
      questionId: id,
      userId: context.userId,
      value: dto.value,
    });
  }
}
