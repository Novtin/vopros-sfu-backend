import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FileExampleImageSchema {
  @ApiProperty({
    type: Number,
    isArray: true,
  })
  @Expose()
  fileIds: number[];
}
