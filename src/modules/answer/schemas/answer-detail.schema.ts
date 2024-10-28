import { UserSchema } from '../../user/schemas/user.schema';
import { QuestionSchema } from '../../question/schemas/question.schema';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDetailSchema {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  text: string;

  @Expose()
  @ApiProperty()
  @Type(() => UserSchema)
  author: UserSchema;

  @Expose()
  @ApiProperty()
  @Type(() => QuestionSchema)
  question: QuestionSchema;

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
