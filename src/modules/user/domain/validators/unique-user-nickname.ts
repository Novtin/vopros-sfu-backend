import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';

@ValidatorConstraint({ name: 'uniqueUserNicknameValidator', async: true })
@Injectable()
export class UniqueUserNicknameValidator
  implements ValidatorConstraintInterface
{
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  async validate(text: string): Promise<boolean> {
    const isUserExistsByNickname: boolean = await this.userService.existBy({
      nickname: text,
    });
    return !isUserExistsByNickname;
  }

  defaultMessage(): string {
    return 'Уже есть такой никнейм';
  }
}
