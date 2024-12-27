import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../global/infrastructure/interceptors/transform.interceptor';
import { TagModel } from '../../domain/models/tag.model';
import { TagSchema } from '../schemas/tag.schema';
import { Authorized } from '../../../auth/infrastructure/decorators/authorized.decorator';
import { TagService } from '../../domain/services/tag.service';
import { SearchTagDto } from '../../domain/dtos/search-tag.dto';
import { ApiOkPagination } from '../../../global/infrastructure/decorators/api-ok-pagination';

@ApiTags('Тэг')
@Authorized()
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Получить тэг' })
  @ApiOkResponse({ type: TagSchema })
  @UseInterceptors(new TransformInterceptor(TagSchema))
  getOneById(@Param('id', ParseIntPipe) id: number): Promise<TagModel> {
    return this.tagService.getOneBy({ id });
  }

  @ApiOkPagination({ type: TagSchema })
  @ApiOperation({ summary: 'Получить тэги' })
  @UseInterceptors(new TransformInterceptor(TagSchema))
  @Get()
  search(@Query() dto: SearchTagDto): Promise<[TagModel[], number]> {
    return this.tagService.search(dto);
  }
}
