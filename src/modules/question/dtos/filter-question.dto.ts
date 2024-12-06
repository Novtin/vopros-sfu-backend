import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { FilterQuestionEnum } from '../enums/filter-question.enum';
import { Type } from 'class-transformer';

export class FilterQuestionDto extends PaginationDto {
  @ApiProperty({
    type: FilterQuestionEnum,
    enum: FilterQuestionEnum,
    required: true,
  })
  @IsEnum(FilterQuestionEnum)
  filter: FilterQuestionEnum;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  authorId?: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  favoriteUserId: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  answeredUserId: number;
}
