import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FileSchema } from '../../../file/infrastructure/schemas/FileSchema';
import { QuestionFavoriteModel } from '../../../question/domain/models/QuestionFavoriteModel';
import { TagFavoriteModel } from '../../../tag/domain/models/TagFavoriteModel';

export class UserSchema {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  nickname: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  isOnline: boolean;

  @Expose()
  @ApiProperty()
  wasOnlineAt: Date;

  @ApiProperty({ type: FileSchema })
  @Expose()
  @Type(() => FileSchema)
  avatar: FileSchema;

  @Expose()
  @ApiProperty({ type: Number })
  @Transform((event) => event.obj.questions?.length ?? 0)
  countQuestions: number;

  @Expose()
  @ApiProperty({ type: Number })
  @Transform((event) => event.obj.answers?.length ?? 0)
  countAnswers: number;

  @Expose()
  @ApiProperty({
    type: Number,
    isArray: true,
  })
  @Transform(
    (event) =>
      event.obj.questionsFavorite?.map(
        (questionFavorite: QuestionFavoriteModel) =>
          questionFavorite.questionId,
      ) || [],
  )
  favoriteQuestionIds: number[];

  @Expose()
  @ApiProperty({
    type: Number,
    isArray: true,
  })
  @Transform(
    (event) =>
      event.obj.tagsFavorite?.map(
        (tagFavorite: TagFavoriteModel) => tagFavorite.tagId,
      ) || [],
  )
  favoriteTagIds: number[];

  @Expose()
  @ApiProperty()
  @Type(() => Number)
  rating: number;
}
