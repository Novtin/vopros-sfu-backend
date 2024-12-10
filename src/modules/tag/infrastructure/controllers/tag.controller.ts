import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../../common/interceptors/transform.interceptor';
import { TagModel } from '../../domain/models/tag.model';
import { TagSchema } from '../schemas/tag.schema';
import { Authorized } from '../../../auth/infrastructure/decorators/authorized.decorator';
import { TagService } from '../../domain/services/tag.service';
import { SearchTagDto } from '../../domain/dtos/search-tag.dto';

@ApiTags('tag')
@Authorized()
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/:id')
  @ApiOkResponse({ type: TagSchema })
  @UseInterceptors(new TransformInterceptor(TagSchema))
  getById(@Param('id', ParseIntPipe) id: number): Promise<TagModel> {
    return this.tagService.getOneBy({ id });
  }

  @ApiOkResponse({
    type: TagSchema,
    isArray: true,
  })
  @UseInterceptors(new TransformInterceptor(TagSchema))
  @Get()
  search(@Query() dto: SearchTagDto): Promise<TagModel[]> {
    return this.tagService.search(dto);
  }
}
