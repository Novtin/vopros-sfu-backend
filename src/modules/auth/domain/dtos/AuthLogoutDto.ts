import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthLogoutDto {
  @ApiProperty({
    type: String,
    description: 'Id входа',
    required: true,
  })
  @IsString()
  loginId: string;
}
