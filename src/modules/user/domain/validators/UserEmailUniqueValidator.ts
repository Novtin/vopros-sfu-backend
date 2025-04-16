import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../services/UserService';

@ValidatorConstraint({ name: 'uniqueUserEmailValidator', async: true })
@Injectable()
export class UserEmailUniqueValidator implements ValidatorConstraintInterface {
  constructor(protected readonly userService: UserService) {}

  async validate(text: string): Promise<boolean> {
    const isUserExistsByEmail: boolean = await this.userService.existBy({
      email: text,
    });
    return !isUserExistsByEmail;
  }

  defaultMessage(): string {
    return 'Уже есть такой email';
  }
}
