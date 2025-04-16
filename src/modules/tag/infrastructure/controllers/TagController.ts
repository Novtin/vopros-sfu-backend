import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagModel } from '../../domain/models/TagModel';
import { TagSchema } from '../schemas/TagSchema';
import { TagService } from '../../domain/services/TagService';
import { TagSearchDto } from '../../domain/dtos/TagSearchDto';
import { SchemaTransform } from '../../../global/infrastructure/decorators/SchemaTransform';

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
  @SchemaTransform(TagSchema, { isPagination: true })
  @Get()
  search(@Query() dto: TagSearchDto): Promise<[TagModel[], number]> {
    return this.tagService.search(dto);
  }
}
