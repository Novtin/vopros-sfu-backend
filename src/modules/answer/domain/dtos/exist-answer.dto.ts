import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ExistAnswerDto {
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
}
