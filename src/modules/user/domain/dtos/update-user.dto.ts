import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { UniqueUserNicknameValidator } from '../validators/unique-user-nickname';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: 'Описание профиля',
    required: true,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  description?: string;

  @ApiProperty({
    type: String,
    description: 'Никнейм',
    required: true,
  })
  @IsString()
  @Validate(UniqueUserNicknameValidator)
  @IsOptional()
  @Type(() => String)
  nickname?: string;

  avatarId?: number;
}
