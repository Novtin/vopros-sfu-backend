import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { FilterQuestionEnum } from '../enums/filter-question.enum';

export class FilterQuestionDto extends PaginationDto {
  @ApiProperty({
    type: FilterQuestionEnum,
    enum: FilterQuestionEnum,
    required: true,
  })
  @IsEnum(FilterQuestionEnum)
  filter: FilterQuestionEnum;
}
