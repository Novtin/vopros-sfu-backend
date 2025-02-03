import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from '../../../global/domain/dtos/pagination.dto';
import { FilterQuestionEnum } from '../enums/filter-question.enum';
import { Type } from 'class-transformer';

export class SearchQuestionDto extends PaginationDto {
  @ApiProperty({
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
  favoriteUserId?: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  answeredUserId?: number;

  @ApiProperty({
    type: String,
    description: 'Заголовок',
    required: false,
  })
  @IsString()
  @Type(() => String)
  @IsOptional()
  title?: string;

  @ApiProperty({
    type: String,
    description: 'Описание',
    required: false,
  })
  @IsString()
  @Type(() => String)
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: Boolean,
    description: 'Решён?',
    required: false,
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isResolved?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Без ответов?',
    required: false,
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isWithoutAnswer?: boolean;

  @ApiProperty({
    type: Number,
    description: 'ID',
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id?: number;
}
