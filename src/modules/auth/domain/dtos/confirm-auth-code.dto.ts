import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthCodeTypeEnum } from '../enums/auth-code-type.enum';
import { ConfirmPayloadAuthCodeDto } from './confirm-payload-auth-code.dto';

export class ConfirmAuthCodeDto {
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
    type: ConfirmPayloadAuthCodeDto,
    description: 'Дополнительные данные',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConfirmPayloadAuthCodeDto)
  payload?: ConfirmPayloadAuthCodeDto;
}
