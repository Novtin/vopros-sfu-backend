import { AppException } from './app-exception';
import { ExceptionEnum } from '../enums/exception.enum';

export class NotFoundException extends AppException {
  constructor(message: string = ExceptionEnum.NOT_FOUND) {
    super(ExceptionEnum.NOT_FOUND, message);
  }
}
