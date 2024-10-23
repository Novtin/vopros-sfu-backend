import { Expose } from 'class-transformer';

export class TagSchema {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
