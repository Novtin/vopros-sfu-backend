import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  @Transform(({ value }) => {
    const page = Number(value);
    return page >= 1 ? page - 1 : 0;
  })
  page?: number = 0;

  @ApiProperty({
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  pageSize?: number = 50;
}
