import { AppException } from './app-exception';
import { ExceptionEnum } from '../enums/exception.enum';

export class UnauthorizedException extends AppException {
  constructor(message: string = ExceptionEnum.UNAUTHORIZED) {
    super(ExceptionEnum.UNAUTHORIZED, message);
  }
}
