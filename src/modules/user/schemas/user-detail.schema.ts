import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserSchema } from './user.schema';

export class UserDetailSchema extends UserSchema {
  @Expose()
  @ApiProperty()
  @Type(() => Number)
  rating: number;
}
