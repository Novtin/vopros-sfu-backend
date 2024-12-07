import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';

@ValidatorConstraint({ name: 'uniqueUserNicknameValidator', async: true })
@Injectable()
export class UniqueUserNicknameValidator
  implements ValidatorConstraintInterface
{
  constructor(protected readonly userService: UserService) {}

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
