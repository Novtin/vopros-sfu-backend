import { Expose, Transform, Type } from 'class-transformer';
import { UserSchema } from '../../user/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionRatingEntity } from '../../question/entities/question-rating.entity';
import { AnswerRatingEntity } from '../entities/answer-rating.entity';

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
