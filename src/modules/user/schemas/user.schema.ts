import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserSchema {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  description: string;
}
