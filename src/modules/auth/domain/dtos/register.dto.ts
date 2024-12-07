import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UniqueUserEmailValidator } from '../../../user/infrastructure/validators/unique-user-email.validator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: 'Электронная почта',
    required: true,
  })
  @IsString()
  @Matches(/^[\w.%+-]+@stud\.sfu-kras\.ru$/, {
    message: 'Электронная почта должна принадлежать домену stud.sfu-kras.ru',
  })
  @IsEmail()
  @Validate(UniqueUserEmailValidator)
  @Type(() => String)
  email: string;

  @ApiProperty({
    type: String,
    description: 'Никнейм',
    required: true,
  })
  @IsString()
  @Validate(UniqueUserEmailValidator)
  @Type(() => String)
  nickname: string;

  @ApiProperty({
    type: String,
    description: 'Пароль',
    required: true,
  })
  @IsString()
  @MinLength(8)
  @Type(() => String)
  password: string;

  @ApiProperty({
    type: String,
    description: 'Описание профиля',
    required: true,
  })
  @IsString()
  @Type(() => String)
  description: string;
}
