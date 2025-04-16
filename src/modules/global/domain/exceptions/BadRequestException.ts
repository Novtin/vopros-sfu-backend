import { AppException } from './AppException';
import { ExceptionEnum } from '../enums/ExceptionEnum';

export class BadRequestException extends AppException {
  constructor(message: string = ExceptionEnum.BAD_REQUEST) {
    super(ExceptionEnum.BAD_REQUEST, message);
  }
}
