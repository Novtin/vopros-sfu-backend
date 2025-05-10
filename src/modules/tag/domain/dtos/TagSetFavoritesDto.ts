import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class TagSetFavoritesDto {
  @ApiProperty({
    type: [Number],
    required: true,
    maxItems: 5,
  })
  @ArrayMaxSize(5)
  @IsInt({ each: true })
  @Type(() => Number)
  tagsIds: number[];
}
