import { ApiProperty } from '@nestjs/swagger';
import { ResultPaginationDto } from '../dtos/result-pagination.dto';

export class ResultPaginationSchema<Model> {
  @ApiProperty()
  total?: number;

  @ApiProperty()
  items?: Model[];

  static createFromDto<M>(
    dto: ResultPaginationDto<M>,
  ): ResultPaginationSchema<M> {
    const result = new this<M>();
    result.items = dto.items;
    result.total = dto.total;
    return result;
  }
}
