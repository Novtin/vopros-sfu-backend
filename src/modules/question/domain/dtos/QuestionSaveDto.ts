import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionSaveDto {
  @ApiProperty({
    type: String,
    description: 'Заголовок',
  })
  @IsString()
  @Type(() => String)
  title: string;

  @ApiProperty({
    type: String,
    description: 'Описание',
  })
  @IsString()
  @Type(() => String)
  description: string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Список тэгов',
  })
  @IsString({ each: true })
  @Type(() => Array<string>)
  tagNames: string[];
}
