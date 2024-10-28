import { Expose, Transform, Type } from 'class-transformer';
import { UserSchema } from '../../user/schemas/user.schema';
import { TagSchema } from '../../tag/schemas/tag.schema';
import { FileSchema } from '../../file/schemas/file.schema';
import { AnswerEntity } from '../../answer/entities/answer.entity';
import { AnswerSchema } from '../../answer/schemas/answer.schema';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionSchema {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty({ type: FileSchema })
  @Type(() => FileSchema)
  images: FileSchema[];

  @Expose()
  @ApiProperty({ type: UserSchema })
  @Type(() => UserSchema)
  author: UserSchema;

  @Expose()
  @ApiProperty({ type: TagSchema })
  @Type(() => TagSchema)
  tags: TagSchema[];

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty({ type: AnswerSchema })
  @Type(() => AnswerSchema)
  answers: AnswerSchema;

  @Expose()
  @ApiProperty()
  @Transform(
    (event) =>
      event.obj.answers?.some((answer: AnswerEntity) => answer.isSolution) ??
      false,
  )
  isResolved: boolean;
}
