import { AppException } from './AppException';
import { ExceptionEnum } from '../enums/ExceptionEnum';

export class ForbiddenException extends AppException {
  constructor(message: string = ExceptionEnum.FORBIDDEN) {
    super(ExceptionEnum.FORBIDDEN, message);
  }
}
