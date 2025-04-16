import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from '../../../global/domain/dtos/PaginationDto';

export class AnswerSearchDto extends PaginationDto {
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
    description: 'ID автора',
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  authorId?: number;

  @ApiProperty({
    type: Number,
    description: 'ID вопроса',
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  questionId?: number;

  @ApiProperty({
    type: String,
    description: 'Текст ответа',
    required: false,
  })
  @IsString()
  @Type(() => String)
  @IsOptional()
  text?: string;

  @ApiProperty({
    type: Boolean,
    description: 'Решение?',
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isSolution?: boolean;
}
