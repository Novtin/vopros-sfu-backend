import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { FileService } from '../../domain/services/file.service';
import { FileExampleImageSchema } from '../schemas/file-example-image.schema';
import { SchemaTransform } from '../../../global/infrastructure/decorators/schema-transform';
import { StreamFileDto } from '../../domain/dtos/stream-file.dto';

@ApiTags('Файл')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: 'Получить список id стандартных изображений' })
  @SchemaTransform(FileExampleImageSchema)
  @Get('/examples-images')
  getExampleImages() {
    return this.fileService.getExampleIds();
  }

  @ApiOkResponse()
  @ApiOperation({ summary: 'Получить файл (не сущность) по id сущности' })
  @Get('/:id')
  async getFileById(
    @Param('id', ParseIntPipe) id: number,
    @Query() dto: StreamFileDto,
  ) {
    return new StreamableFile(
      await this.fileService.getReadStreamByFileId(id, dto),
    );
  }
}
