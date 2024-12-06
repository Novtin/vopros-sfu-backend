import { FilterUserEnum } from '../enum/filter-user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { FilterQuestionEnum } from '../../question/enums/filter-question.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { Type } from 'class-transformer';

export class FilterUserDto extends PaginationDto {
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
