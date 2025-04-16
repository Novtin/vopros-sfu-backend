import { UserSchema } from '../../../user/infrastructure/schemas/UserSchema';
import { QuestionSchema } from '../../../question/infrastructure/schemas/QuestionSchema';
import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AnswerRatingModel } from '../../domain/models/AnswerRatingModel';

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
        ?.filter((rate: AnswerRatingModel) => rate.value === 1)
        ?.map((rate: AnswerRatingModel) => rate.userId) ?? [],
  )
  likeUserIds: number[];

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj }) =>
      obj.rate
        ?.filter((rating: AnswerRatingModel) => rating.value === -1)
        ?.map((rating: AnswerRatingModel) => rating.userId) ?? [],
  )
  dislikeUserIds: number[];

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
