import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class QuestionCountSchema {
  @ApiProperty()
  @Expose()
  count: number;
}
