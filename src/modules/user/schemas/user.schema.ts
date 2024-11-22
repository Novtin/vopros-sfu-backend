import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FileSchema } from '../../file/schemas/file.schema';

export class UserSchema {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  description: string;

  @ApiProperty({ type: FileSchema })
  @Expose()
  @Type(() => FileSchema)
  avatar: FileSchema;
}
