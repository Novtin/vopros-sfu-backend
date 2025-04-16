import { AuthCodeTypeEnum } from '../enums/AuthCodeTypeEnum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AuthCodeCreateOrUpdateDto {
  @ApiProperty({
    type: String,
    description: 'Email пользователя',
    required: true,
  })
  @IsString()
  @Type(() => String)
  email: string;

  @ApiProperty({
    enum: AuthCodeTypeEnum,
    description: 'Тип кода',
    required: true,
  })
  @IsEnum(AuthCodeTypeEnum)
  type: AuthCodeTypeEnum;
}
