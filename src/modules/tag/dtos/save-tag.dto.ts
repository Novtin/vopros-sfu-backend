import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SaveTagDto {
  @ApiProperty({
    type: String,
    description: 'Название',
  })
  @IsString()
  @Type(() => String)
  name: string;
}