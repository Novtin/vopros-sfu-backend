import { ApiTags } from '@nestjs/swagger';
import { Authorized } from '../../auth/decorators/authorized.decorator';
import { RoleEnum } from '../../user/enum/role.enum';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FileService } from '../services/file.service';

@ApiTags('file')
@Authorized(...Object.values(RoleEnum))
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('/:id')
  getFileById(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.getFileById(id);
  }
}
