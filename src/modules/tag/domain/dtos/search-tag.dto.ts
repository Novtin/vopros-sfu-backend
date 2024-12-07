import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';

export class SearchTagDto extends PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'ID',
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiProperty({
    type: String,
    description: 'Название',
    required: false,
  })
  @IsString()
  @Type(() => String)
  name?: string;
}
