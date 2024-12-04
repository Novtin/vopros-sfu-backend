import { Expose, Transform, Type } from 'class-transformer';
import { UserSchema } from '../../user/schemas/user.schema';
import { TagSchema } from '../../tag/schemas/tag.schema';
import { FileSchema } from '../../file/schemas/file.schema';
import { AnswerEntity } from '../../answer/entities/answer.entity';
import { AnswerSchema } from '../../answer/schemas/answer.schema';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionRatingEntity } from '../entities/question-rating.entity';

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
      event.obj.answers?.some((answer: AnswerEntity) => answer.isSolution) ??
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
        ?.filter((rate: QuestionRatingEntity) => rate.value === 1)
        ?.map((rate: QuestionRatingEntity) => rate.userId) ?? [],
  )
  likeUserIds: number[];

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj }) =>
      obj.rating?.filter((rate: QuestionRatingEntity) => rate.value === 1)
        ?.length ?? 0,
  )
  countLikes: number;

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj }) =>
      obj.rating?.filter((rate: QuestionRatingEntity) => rate.value === -1)
        ?.length ?? 0,
  )
  countDislikes: number;

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj }) =>
      obj.rating?.reduce(
        (acc: number, cur: QuestionRatingEntity) => acc + cur.value,
        0,
      ) ?? 0,
  )
  rating: number;

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj }) =>
      obj.rating
        ?.filter((rating: QuestionRatingEntity) => rating.value === -1)
        ?.map((rating: QuestionRatingEntity) => rating.userId) ?? [],
  )
  dislikeUserIds: number[];
}
