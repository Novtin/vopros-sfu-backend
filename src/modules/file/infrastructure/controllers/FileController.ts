import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { FileService } from '../../domain/services/FileService';
import { FileExampleImageSchema } from '../schemas/FileExampleImageSchema';
import { SchemaTransform } from '../../../global/infrastructure/decorators/SchemaTransform';
import { FileStreamDto } from '../../domain/dtos/FileStreamDto';

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
    @Query() dto: FileStreamDto,
  ) {
    return new StreamableFile(
      await this.fileService.getReadStreamByFileId(id, dto),
    );
  }
}
