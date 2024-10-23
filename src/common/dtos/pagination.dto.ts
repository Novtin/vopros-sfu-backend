import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number = 0;

  @ApiProperty({
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  pageSize?: number = 50;
}
