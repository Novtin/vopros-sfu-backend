import { AppException } from './app-exception';
import { ExceptionEnum } from '../enums/exception.enum';

export class UnprocessableEntityException extends AppException {
  constructor(message: string = ExceptionEnum.UNPROCESSABLE_ENTITY) {
    super(ExceptionEnum.UNPROCESSABLE_ENTITY, message);
  }
}
