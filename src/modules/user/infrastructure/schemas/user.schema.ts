import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FileSchema } from '../../../file/infrastructure/schemas/file.schema';

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
  @ApiProperty()
  @Type(() => Number)
  rating: number;
}
