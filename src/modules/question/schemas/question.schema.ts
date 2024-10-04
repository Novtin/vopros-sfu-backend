import { Expose } from 'class-transformer';

export class QuestionSchema {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;
}
