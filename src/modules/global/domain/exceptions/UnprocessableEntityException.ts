import { AppException } from './AppException';
import { ExceptionEnum } from '../enums/ExceptionEnum';

export class UnprocessableEntityException extends AppException {
  constructor(message: string = ExceptionEnum.UNPROCESSABLE_ENTITY) {
    super(ExceptionEnum.UNPROCESSABLE_ENTITY, message);
  }
}
