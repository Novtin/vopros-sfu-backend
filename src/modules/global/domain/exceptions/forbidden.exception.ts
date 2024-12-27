import { AppException } from './app-exception';
import { ExceptionEnum } from '../enums/exception.enum';

export class ForbiddenException extends AppException {
  constructor(message: string = ExceptionEnum.FORBIDDEN) {
    super(ExceptionEnum.FORBIDDEN, message);
  }
}
