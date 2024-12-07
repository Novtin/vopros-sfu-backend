import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SaveAnswerDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  questionId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  text: string;
}
