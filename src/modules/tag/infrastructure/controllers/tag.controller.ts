import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagModel } from '../../domain/models/tag.model';
import { TagSchema } from '../schemas/tag.schema';
import { TagService } from '../../domain/services/tag.service';
import { SearchTagDto } from '../../domain/dtos/search-tag.dto';
import { SchemaTransform } from '../../../global/infrastructure/decorators/schema-transform';

@ApiTags('Тэг')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Получить тэг' })
  @SchemaTransform(TagSchema)
  getOneById(@Param('id', ParseIntPipe) id: number): Promise<TagModel> {
    return this.tagService.getOneBy({ id });
  }

  @ApiOperation({ summary: 'Получить тэги' })
  @SchemaTransform(TagSchema, { pagination: true })
  @Get()
  search(@Query() dto: SearchTagDto): Promise<[TagModel[], number]> {
    return this.tagService.search(dto);
  }
}
