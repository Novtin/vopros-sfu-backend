import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAnswerDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  text?: string;
}
