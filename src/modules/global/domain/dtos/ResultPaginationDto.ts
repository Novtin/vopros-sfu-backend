export class ResultPaginationDto<T> {
  total?: number;

  items: T[];
}
