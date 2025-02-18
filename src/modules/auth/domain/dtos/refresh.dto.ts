import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RefreshDto {
  @ApiProperty({
    type: Number,
    description: 'Id входа',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  loginId: number;

  @ApiProperty({
    type: String,
    description: 'Refresh токен',
    required: true,
  })
  @IsString()
  @Type(() => String)
  refreshToken: string;
}
