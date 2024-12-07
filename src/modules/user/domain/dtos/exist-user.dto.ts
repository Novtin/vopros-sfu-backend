import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ExistUserDto {
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
    description: 'Никнейм',
    required: true,
  })
  @IsString()
  @Type(() => String)
  nickname?: string;

  @ApiProperty({
    type: String,
    description: 'Хэш маила',
    required: true,
  })
  @IsString()
  @Type(() => String)
  emailHash?: string;

  @ApiProperty({
    type: String,
    description: 'Описание профиля',
    required: true,
  })
  @IsString()
  @Type(() => String)
  description?: string;
}
