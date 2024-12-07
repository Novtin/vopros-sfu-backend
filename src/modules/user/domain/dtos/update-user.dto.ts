import { PartialType } from '@nestjs/swagger';
import { SaveUserDto } from './save-user.dto';

export class UpdateUserDto extends PartialType(SaveUserDto) {
  avatarId?: number;
}
