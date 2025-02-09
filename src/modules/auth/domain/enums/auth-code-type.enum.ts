import { EventEnum } from '../../../global/domain/enums/event.enum';

export enum AuthCodeTypeEnum {
  REGISTER_USER = 'register_user',
  RESET_PASSWORD_USER = 'reset_password_user',
}

export class AuthCodeTypeEnumHelper {
  static toEventEnum(label: AuthCodeTypeEnum): EventEnum {
    switch (label) {
      case AuthCodeTypeEnum.REGISTER_USER:
        return EventEnum.REGISTER_USER;
      case AuthCodeTypeEnum.RESET_PASSWORD_USER:
        return EventEnum.RESET_PASSWORD_USER;
    }
  }
}
