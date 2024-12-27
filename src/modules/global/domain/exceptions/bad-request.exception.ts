import { AppException } from './app-exception';
import { ExceptionEnum } from '../enums/exception.enum';

export class BadRequestException extends AppException {
  constructor(message: string = ExceptionEnum.BAD_REQUEST) {
    super(ExceptionEnum.BAD_REQUEST, message);
  }
}
