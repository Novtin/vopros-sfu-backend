import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from '../../../global/domain/dtos/PaginationDto';

export class NotificationSearchDto extends PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'ID',
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id?: number;

  @ApiProperty({
    type: Number,
    description: 'ID получателя',
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  userId?: number;

  @ApiProperty({
    type: Boolean,
    description: 'Просмотрено?',
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isViewed?: boolean;
}
