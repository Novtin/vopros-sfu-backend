import { AuthCodeTypeEnum } from '../enums/auth-code-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrUpdateAuthCodeDto {
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
}
