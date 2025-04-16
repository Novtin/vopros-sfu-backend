import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserSortEnum } from '../enums/UserSortEnum';
import { PaginationDto } from '../../../global/domain/dtos/PaginationDto';

export class UserSearchDto extends PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'ID',
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @ApiProperty({
    enum: UserSortEnum,
    required: true,
  })
  @IsEnum(UserSortEnum)
  sort: UserSortEnum;

  @ApiProperty({
    type: String,
    description: 'Никнейм или Электронная почта',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  query?: string;

  @ApiProperty({
    type: Boolean,
    description: 'С удалёнными?',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  withDeleted?: boolean;
}
