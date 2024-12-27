import { AppException } from './app-exception';
import { ExceptionEnum } from '../enums/exception.enum';

export class ConflictException extends AppException {
  constructor(message: string = ExceptionEnum.CONFLICT) {
    super(ExceptionEnum.CONFLICT, message);
  }
}
