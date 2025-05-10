import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationSchema {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  userId: string;

  @Expose()
  @ApiProperty()
  payload: any;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  isViewed: boolean;
}
