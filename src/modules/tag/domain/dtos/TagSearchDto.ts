import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../global/domain/dtos/PaginationDto';
import { TagSortEnum } from '../enums/TagSortEnum';

export class TagSearchDto extends PaginationDto {
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
    enum: TagSortEnum,
    required: false,
  })
  @IsEnum(TagSortEnum)
  @IsOptional()
  sort?: TagSortEnum;
}
