import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FileSchema {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  size: number;

  @Expose()
  @ApiProperty()
  mimetype: string;
}
