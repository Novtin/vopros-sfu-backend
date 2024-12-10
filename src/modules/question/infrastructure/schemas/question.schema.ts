import { Expose, Transform, Type } from 'class-transformer';
import { UserSchema } from '../../../user/infrastructure/schemas/user.schema';
import { TagSchema } from '../../../tag/infrastructure/schemas/tag.schema';
import { FileSchema } from '../../../file/infrastructure/schemas/file.schema';
import { AnswerModel } from '../../../answer/domain/models/answer.model';
import { AnswerSchema } from '../../../answer/infrastructure/schemas/answer.schema';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionRatingModel } from '../../domain/models/question-rating.model';

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
  @ApiProperty({ type: AnswerSchema })
  @Transform((event) => event.obj.answers?.length ?? 0)
  countAnswers: number;

  @Expose()
  @ApiProperty()
  @Transform(
    (event) =>
      event.obj.answers?.some((answer: AnswerModel) => answer.isSolution) ??
      false,
  )
  isResolved: boolean;

  @Expose()
  @ApiProperty()
  @Transform((event) => event.obj.views.length)
  views: number;

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj }) =>
      obj.rating
        ?.filter((rate: QuestionRatingModel) => rate.value === 1)
        ?.map((rate: QuestionRatingModel) => rate.userId) ?? [],
  )
  likeUserIds: number[];

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj }) =>
      obj.rating?.filter((rate: QuestionRatingModel) => rate.value === 1)
        ?.length ?? 0,
  )
  countLikes: number;

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj }) =>
      obj.rating?.filter((rate: QuestionRatingModel) => rate.value === -1)
        ?.length ?? 0,
  )
  countDislikes: number;

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj }) =>
      obj.rating?.reduce(
        (acc: number, cur: QuestionRatingModel) => acc + cur.value,
        0,
      ) ?? 0,
  )
  rating: number;

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj }) =>
      obj.rating
        ?.filter((rating: QuestionRatingModel) => rating.value === -1)
        ?.map((rating: QuestionRatingModel) => rating.userId) ?? [],
  )
  dislikeUserIds: number[];
}
