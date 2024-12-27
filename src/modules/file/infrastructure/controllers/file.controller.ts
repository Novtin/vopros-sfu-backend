import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorized } from '../../../auth/infrastructure/decorators/authorized.decorator';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';
import { FileService } from '../../domain/services/file.service';

@ApiTags('Файл')
@Authorized()
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOkResponse()
  @ApiOperation({ summary: 'Получить файл (не сущность) по id сущности' })
  @Get('/:id')
  async getFileById(@Param('id', ParseIntPipe) id: number) {
    return new StreamableFile(await this.fileService.getReadStreamByFileId(id));
  }
}
