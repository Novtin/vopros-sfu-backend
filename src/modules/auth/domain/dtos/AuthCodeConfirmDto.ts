import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthCodeTypeEnum } from '../enums/AuthCodeTypeEnum';
import { AuthCodeConfirmPayloadDto } from './AuthCodeConfirmPayloadDto';

export class AuthCodeConfirmDto {
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

  @ApiProperty({
    type: String,
    description: 'Код',
    required: true,
  })
  @IsString()
  @Type(() => String)
  code: string;

  @ApiProperty({
    type: AuthCodeConfirmPayloadDto,
    description: 'Дополнительные данные',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AuthCodeConfirmPayloadDto)
  payload?: AuthCodeConfirmPayloadDto;
}
