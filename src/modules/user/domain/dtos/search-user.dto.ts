import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterUserEnum } from '../enum/filter-user.enum';
import { FilterQuestionEnum } from '../../../question/domain/enums/filter-question.enum';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';

export class SearchUserDto extends PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'ID',
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiProperty({
    type: FilterUserEnum,
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
}
