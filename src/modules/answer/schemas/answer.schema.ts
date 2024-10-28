import { Expose, Type } from 'class-transformer';
import { UserSchema } from '../../user/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerSchema {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  text: string;

  @Expose()
  @ApiProperty({ type: UserSchema })
  @Type(() => UserSchema)
  author: UserSchema;

  @Expose()
  @ApiProperty()
  questionId: number;

  @Expose()
  @ApiProperty()
  isSolution: boolean;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
