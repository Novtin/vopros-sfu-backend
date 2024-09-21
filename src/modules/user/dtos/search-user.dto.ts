import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchUserDto {
  @ApiProperty({
    type: Number,
    description: 'ID',
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiProperty({
    type: String,
    description: 'Электронная почта',
    required: true,
  })
  @IsString()
  @IsEmail()
  @Type(() => String)
  email?: string;

  @ApiProperty({
    type: String,
    description: 'Пароль',
    required: true,
  })
  @IsString()
  @Type(() => String)
  passwordHash?: string;

  @ApiProperty({
    type: String,
    description: 'Описание профиля',
    required: true,
  })
  @IsString()
  @Type(() => String)
  description?: string;
}
