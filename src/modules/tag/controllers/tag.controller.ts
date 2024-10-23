import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor';
import { TagEntity } from '../entities/tag.entity';
import { TagSchema } from '../schemas/tag.schema';
import { Authorized } from '../../auth/decorators/authorized.decorator';
import { RoleEnum } from '../../user/enum/role.enum';
import { TagService } from '../services/tag.service';
import { SearchTagDto } from '../dtos/search-tag.dto';

@ApiTags('tag')
@Authorized(...Object.values(RoleEnum))
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/:id')
  @ApiOkResponse({ type: TagSchema })
  @UseInterceptors(new TransformInterceptor(TagSchema))
  getById(@Param('id', ParseIntPipe) id: number): Promise<TagEntity> {
    return this.tagService.getOneBy({ id });
  }

  @ApiOkResponse({
    type: TagSchema,
    isArray: true,
  })
  @UseInterceptors(new TransformInterceptor(TagSchema))
  @Get()
  search(@Query() dto: SearchTagDto): Promise<TagEntity[]> {
    return this.tagService.search(dto);
  }
}
