import { Expose, Transform, Type } from 'class-transformer';
import { UserSchema } from '../../../user/infrastructure/schemas/UserSchema';
import { ApiProperty } from '@nestjs/swagger';
import { AnswerRatingModel } from '../../domain/models/AnswerRatingModel';

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
      obj.rating
        ?.filter((rate: AnswerRatingModel) => rate.value === 1)
        ?.map((rate: AnswerRatingModel) => rate.userId) ?? [],
  )
  likeUserIds: number[];

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj }) =>
      obj.rating
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
