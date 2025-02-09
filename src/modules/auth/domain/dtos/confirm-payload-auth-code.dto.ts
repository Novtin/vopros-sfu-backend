import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class ConfirmPayloadAuthCodeDto {
  @ApiProperty({
    type: String,
    description: 'Новый пароль',
    required: false,
  })
  @IsOptional()
  @MinLength(8)
  @IsString()
  @Type(() => String)
  password?: string;

  [key: string]: any;
}
