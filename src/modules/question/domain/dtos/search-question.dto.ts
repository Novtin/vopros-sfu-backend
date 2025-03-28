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
import { PaginationDto } from '../../../global/domain/dtos/pagination.dto';
import { SortQuestionEnum } from '../enums/sort-question.enum';
import { Transform, Type } from 'class-transformer';

export class SearchQuestionDto extends PaginationDto {
  @ApiProperty({
    enum: SortQuestionEnum,
    required: true,
  })
  @IsEnum(SortQuestionEnum)
  sort: SortQuestionEnum;

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
