import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StreamFileDto {
  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isExample: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isMiniature: boolean;
}
