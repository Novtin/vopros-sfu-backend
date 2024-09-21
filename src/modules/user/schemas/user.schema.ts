import { Expose } from 'class-transformer';

export class UserSchema {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  description: string;
}
