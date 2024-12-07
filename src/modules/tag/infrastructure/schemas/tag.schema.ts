import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TagSchema {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;
}
