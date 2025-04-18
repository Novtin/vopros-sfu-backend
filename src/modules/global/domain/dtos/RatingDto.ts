import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { RatingValueEnum } from '../enums/RatingValueEnum';

export class RatingDto {
  @ApiProperty({
    enum: RatingValueEnum,
    description: 'Значение -1 или 1',
    required: true,
  })
  @IsEnum(RatingValueEnum)
  @Type(() => Number)
  @IsNotEmpty()
  value: RatingValueEnum;
}
