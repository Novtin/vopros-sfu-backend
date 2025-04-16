import { ExceptionEnum } from '../enums/ExceptionEnum';

export abstract class AppException extends Error {
  protected constructor(
    readonly type: ExceptionEnum,
    readonly message: string,
  ) {
    super(message);
  }
}
