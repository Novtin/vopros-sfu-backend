import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class JwtSchema {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;
}
