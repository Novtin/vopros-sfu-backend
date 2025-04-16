import { AppException } from './AppException';
import { ExceptionEnum } from '../enums/ExceptionEnum';

export class NotFoundException extends AppException {
  constructor(message: string = ExceptionEnum.NOT_FOUND) {
    super(ExceptionEnum.NOT_FOUND, message);
  }
}
