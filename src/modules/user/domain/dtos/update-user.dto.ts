import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { UniqueUserNicknameValidator } from '../validators/unique-user-nickname';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: 'Идентификатор пользователя',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({
    type: String,
    description: 'Описание профиля',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  description?: string;

  @ApiProperty({
    type: String,
    description: 'Никнейм',
    required: false,
  })
  @IsString()
  @Validate(UniqueUserNicknameValidator)
  @IsOptional()
  @Type(() => String)
  nickname?: string;

  avatarId?: number;
}
