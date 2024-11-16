import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ConfirmEmailDto {
  @ApiProperty({
    type: String,
    description: 'Хэш емаила',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  emailHash: string;
}
