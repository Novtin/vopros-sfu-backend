import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCodeConfirmSchema {
  @ApiProperty({
    type: Boolean,
  })
  @Expose()
  isConfirmed: boolean;

  @ApiProperty({
    type: Number,
  })
  @Expose()
  availableAttempts: number;
}
