import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagModel } from '../../domain/models/TagModel';
import { TagSchema } from '../schemas/TagSchema';
import { TagService } from '../../domain/services/TagService';
import { TagSearchDto } from '../../domain/dtos/TagSearchDto';
import { SchemaTransform } from '../../../global/infrastructure/decorators/SchemaTransform';
import { TagSetFavoritesDto } from '../../domain/dtos/TagSetFavoritesDto';
import { TagFavoriteService } from '../../domain/services/TagFavoriteService';
import { Authorized } from '../../../auth/infrastructure/decorators/Authorized';
import { Context } from '../../../auth/infrastructure/decorators/Context';
import { ContextDto } from '../../../auth/domain/dtos/ContextDto';

@ApiTags('Тэг')
@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly tagFavoriteService: TagFavoriteService,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Получить тэг' })
  @SchemaTransform(TagSchema)
  getOneById(@Param('id', ParseIntPipe) id: number): Promise<TagModel> {
    return this.tagService.getOneBy({ id });
  }

  @ApiOperation({ summary: 'Получить тэги' })
  @SchemaTransform(TagSchema, { isPagination: true })
  @Get()
  search(@Query() dto: TagSearchDto): Promise<[TagModel[], number]> {
    return this.tagService.search(dto);
  }

  @Authorized()
  @Post('/favorites')
  @ApiOperation({ summary: 'Поставить пользователю избранные тэги' })
  @HttpCode(HttpStatus.NO_CONTENT)
  setFavorites(
    @Body() dto: TagSetFavoritesDto,
    @Context() context: ContextDto,
  ) {
    return this.tagFavoriteService.setFavorites(context.userId, dto);
  }
}
