import { Expose } from 'class-transformer';

export class FileSchema {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  size: number;

  @Expose()
  mimetype: string;
}
