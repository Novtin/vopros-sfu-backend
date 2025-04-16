import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from '../../../global/domain/dtos/PaginationDto';
import { QuestionSortEnum } from '../enums/QuestionSortEnum';
import { Transform, Type } from 'class-transformer';

export class QuestionSearchDto extends PaginationDto {
  @ApiProperty({
    enum: QuestionSortEnum,
    required: true,
  })
  @IsEnum(QuestionSortEnum)
  sort: QuestionSortEnum;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  authorId?: number;

  @ApiProperty({
    type: [Number],
    required: false,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [parseInt(value, 10)],
  )
  tagIds?: number[];

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
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isResolved?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Без ответов?',
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isWithoutAnswer?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Без просмотров?',
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isWithoutView?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Без голосов?',
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isWithoutRating?: boolean;

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
