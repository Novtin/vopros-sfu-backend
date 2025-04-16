import { AppException } from './AppException';
import { ExceptionEnum } from '../enums/ExceptionEnum';

export class UnauthorizedException extends AppException {
  constructor(message: string = ExceptionEnum.UNAUTHORIZED) {
    super(ExceptionEnum.UNAUTHORIZED, message);
  }
}
