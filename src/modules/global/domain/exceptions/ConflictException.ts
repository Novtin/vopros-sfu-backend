import { AppException } from './AppException';
import { ExceptionEnum } from '../enums/ExceptionEnum';

export class ConflictException extends AppException {
  constructor(message: string = ExceptionEnum.CONFLICT) {
    super(ExceptionEnum.CONFLICT, message);
  }
}
