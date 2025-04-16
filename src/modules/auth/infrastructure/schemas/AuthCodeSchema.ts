import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AuthCodeTypeEnum } from '../../domain/enums/AuthCodeTypeEnum';

export class AuthCodeSchema {
  @ApiProperty({
    type: Number,
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: Number,
  })
  @Expose()
  userId: number;

  @ApiProperty({
    enum: AuthCodeTypeEnum,
  })
  @Expose()
  type: AuthCodeTypeEnum;

  @ApiProperty({
    type: Date,
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    type: Date,
  })
  @Expose()
  isActiveAt: Date;

  @ApiProperty({
    type: Number,
  })
  @Expose()
  availableAttempts: number;
}
