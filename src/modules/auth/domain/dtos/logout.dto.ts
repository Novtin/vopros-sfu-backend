import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class LogoutDto {
  @ApiProperty({
    type: Number,
    description: 'Id входа',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  loginId: number;
}
