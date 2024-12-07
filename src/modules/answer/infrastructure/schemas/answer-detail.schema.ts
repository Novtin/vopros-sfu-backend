import { UserSchema } from '../../../user/infrastructure/schemas/user.schema';
import { QuestionSchema } from '../../../question/infrastructure/schemas/question.schema';
import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AnswerRatingEntity } from '../../domain/entities/answer-rating.entity';

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
  @Transform(
    ({ obj }) =>
      obj.rate
        ?.filter((rate: AnswerRatingEntity) => rate.value === 1)
        ?.map((rate: AnswerRatingEntity) => rate.userId) ?? [],
  )
  likeUserIds: number[];

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj }) =>
      obj.rate
        ?.filter((rating: AnswerRatingEntity) => rating.value === -1)
        ?.map((rating: AnswerRatingEntity) => rating.userId) ?? [],
  )
  dislikeUserIds: number[];

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
