import { Expose, Transform, Type } from 'class-transformer';
import { UserSchema } from '../../../user/infrastructure/schemas/UserSchema';
import { TagSchema } from '../../../tag/infrastructure/schemas/TagSchema';
import { FileSchema } from '../../../file/infrastructure/schemas/FileSchema';
import { AnswerSchema } from '../../../answer/infrastructure/schemas/AnswerSchema';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionRatingModel } from '../../domain/models/QuestionRatingModel';
import { AnswerModel } from '../../../answer/domain/models/AnswerModel';

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
  @ApiProperty({ type: FileSchema, isArray: true })
  @Type(() => FileSchema)
  images: FileSchema[];

  @Expose()
  @ApiProperty({ type: UserSchema })
  @Type(() => UserSchema)
  author: UserSchema;

  @Expose()
  @ApiProperty({ type: TagSchema, isArray: true })
  @Type(() => TagSchema)
  tags: TagSchema[];

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty({ type: AnswerSchema, isArray: true })
  @Type(() => AnswerSchema)
  answers: AnswerSchema[];

  @Expose()
  @ApiProperty()
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
  @Transform((event) => event.obj.views?.length ?? 0)
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
