import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FilterUserEnum } from '../enum/filter-user.enum';
import { FilterQuestionEnum } from '../../../question/domain/enums/filter-question.enum';
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
    enum: FilterUserEnum,
    required: true,
  })
  @IsEnum(FilterQuestionEnum)
  filter: FilterUserEnum;

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
  @Type(() => Boolean)
  withDeleted?: boolean;
}
