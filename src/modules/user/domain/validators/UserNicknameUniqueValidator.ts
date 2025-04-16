import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../services/UserService';

@ValidatorConstraint({ name: 'uniqueUserNicknameValidator', async: true })
@Injectable()
export class UniqueUserNicknameValidator
  implements ValidatorConstraintInterface
{
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  async validate(text: string, args: ValidationArguments): Promise<boolean> {
    const userId = (args.object as { id: number }).id;
    const isUserExistsByNickname: boolean = await this.userService.existBy({
      id: userId,
      nickname: text,
    });
    return userId ? isUserExistsByNickname : !isUserExistsByNickname;
  }

  defaultMessage(): string {
    return 'Уже есть такой никнейм';
  }
}
