import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { RoleEnum } from '../../../user/domain/enum/role.enum';

export class LoginDto {
  @ApiProperty({
    type: String,
    description: 'Электронная почта',
    required: true,
  })
  @IsString()
  @IsEmail()
  @ValidateIf((object) => object.email !== RoleEnum.ADMIN)
  @Type(() => String)
  email: string;

  @ApiProperty({
    type: String,
    description: 'Пароль',
    required: true,
  })
  @IsString()
  @Type(() => String)
  password: string;
}
