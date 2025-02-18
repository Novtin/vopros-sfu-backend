import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginSchema {
  @Expose({ name: 'id' })
  @ApiProperty()
  loginId: number;

  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;
}
