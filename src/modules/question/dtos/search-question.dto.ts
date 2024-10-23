import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dtos/pagination.dto';

export class SearchQuestionDto extends PaginationDto {
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
    description: 'Описаное',
    required: false,
  })
  @IsString()
  @Type(() => String)
  @IsOptional()
  description?: string;
}
