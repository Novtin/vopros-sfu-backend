import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class RateDto {
  @ApiProperty({
    type: Number,
    description: 'Значение -1 или 1',
    required: true,
  })
  @IsIn([-1, 1])
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  value: number;
}
