import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UserPasswordUpdateDto {
  @ApiProperty({
    type: Number,
    description: 'ID пользователя',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    type: String,
    description: 'Новый пароль',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  @Type(() => String)
  password: string;
}
