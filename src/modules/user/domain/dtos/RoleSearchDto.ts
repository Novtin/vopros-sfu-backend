import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RoleSearchDto {
  @ApiProperty({
    type: Number,
    description: 'ID',
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiProperty({
    type: String,
    description: 'Название',
    required: true,
  })
  @IsString()
  @Type(() => String)
  name?: string;
}
