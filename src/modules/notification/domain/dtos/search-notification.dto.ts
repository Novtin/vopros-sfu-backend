import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';

export class SearchNotificationDto extends PaginationDto {
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
  @Type(() => Boolean)
  @IsOptional()
  isViewed?: boolean;
}
