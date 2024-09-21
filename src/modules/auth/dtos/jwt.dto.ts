import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class JwtDto {
  @ApiProperty({
    type: String,
    description: 'Access токен',
    required: true,
  })
  @IsString()
  @Type(() => String)
  accessToken: string;

  @ApiProperty({
    type: String,
    description: 'Refresh токен',
    required: true,
  })
  @IsString()
  @Type(() => String)
  refreshToken: string;
}
