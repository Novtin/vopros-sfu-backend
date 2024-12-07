import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';

@ValidatorConstraint({ name: 'uniqueUserEmailValidator', async: true })
@Injectable()
export class UniqueUserEmailValidator implements ValidatorConstraintInterface {
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
