import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AuthCodeTypeEnum } from '../enums/auth-code-type.enum';
import { ConfirmPayloadAuthCodeDto } from './confirm-payload-auth-code.dto';

export class ConfirmAuthCodeDto {
  @ApiProperty({
    type: Number,
    description: 'ID пользователя',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  userId: number;

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
