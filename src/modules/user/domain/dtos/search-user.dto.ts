import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SortUserEnum } from '../enums/sort-user.enum';
import { PaginationDto } from '../../../global/domain/dtos/pagination.dto';

export class SearchUserDto extends PaginationDto {
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
    enum: SortUserEnum,
    required: true,
  })
  @IsEnum(SortUserEnum)
  sort: SortUserEnum;

  @ApiProperty({
    type: String,
    description: 'Никнейм или Электронная почта',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  query?: string;

  @ApiProperty({
    type: Boolean,
    description: 'С удалёнными?',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  withDeleted?: boolean;
}
