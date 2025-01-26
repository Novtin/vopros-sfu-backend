import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ConfirmPasswordResetUserDto {
  @ApiProperty({
    type: String,
    description: 'Хэш емаила',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  emailHash: string;

  @ApiProperty({
    type: String,
    description: 'Новый пароль',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  password: string;
}
