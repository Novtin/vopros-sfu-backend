import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AuthRefreshDto {
  @ApiProperty({
    type: String,
    description: 'Id входа',
    required: true,
  })
  @IsString()
  loginId: string;

  @ApiProperty({
    type: String,
    description: 'Refresh токен',
    required: true,
  })
  @IsString()
  @Type(() => String)
  refreshToken: string;
}
