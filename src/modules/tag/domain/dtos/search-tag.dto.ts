import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../global/domain/dtos/pagination.dto';
import { SortTagEnum } from '../enums/sort-tag.enum';

export class SearchTagDto extends PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'ID',
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @ApiProperty({
    type: String,
    description: 'Название',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  name?: string;

  @ApiProperty({
    enum: SortTagEnum,
    required: false,
  })
  @IsEnum(SortTagEnum)
  @IsOptional()
  sort?: SortTagEnum;
}
