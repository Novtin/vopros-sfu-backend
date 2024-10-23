import { Expose, Type } from 'class-transformer';
import { UserSchema } from '../../user/schemas/user.schema';
import { TagSchema } from '../../tag/schemas/tag.schema';
import { FileSchema } from '../../file/schemas/file.schema';

export class QuestionSchema {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => FileSchema)
  images: FileSchema[];

  @Expose()
  @Type(() => UserSchema)
  author: UserSchema;

  @Expose()
  @Type(() => TagSchema)
  tags: TagSchema[];
}
