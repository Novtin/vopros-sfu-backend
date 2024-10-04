import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dtos/pagination.dto';

export class SearchQuestionDto extends PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'ID',
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiProperty({
    type: Number,
    description: 'ID автора',
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  authorId?: number;

  @ApiProperty({
    type: String,
    description: 'Заголовок',
    required: true,
  })
  @IsString()
  @Type(() => String)
  title?: string;

  @ApiProperty({
    type: String,
    description: 'Описаное',
    required: true,
  })
  @IsString()
  @Type(() => String)
  description?: string;
}
