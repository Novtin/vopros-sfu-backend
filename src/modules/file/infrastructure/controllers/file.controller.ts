import { ApiTags } from '@nestjs/swagger';
import { Authorized } from '../../../auth/infrastructure/decorators/authorized.decorator';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FileService } from '../../domain/services/file.service';

@ApiTags('file')
@Authorized()
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('/:id')
  getFileById(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.getFileById(id);
  }
}
