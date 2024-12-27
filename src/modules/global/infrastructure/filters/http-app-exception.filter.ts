import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AppException } from '../../domain/exceptions/app-exception';
import { ExceptionEnum } from '../../domain/enums/exception.enum';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(AppException)
export class HttpAppExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: AppException, host: ArgumentsHost) {
    try {
      switch (exception.type) {
        case ExceptionEnum.FORBIDDEN:
          throw new ForbiddenException(exception.message);
        case ExceptionEnum.NOT_FOUND:
          throw new NotFoundException(exception.message);
        case ExceptionEnum.BAD_REQUEST:
          throw new BadRequestException(exception.message);
        case ExceptionEnum.CONFLICT:
          throw new ConflictException(exception.message);
        case ExceptionEnum.UNAUTHORIZED:
          throw new UnauthorizedException(exception.message);
        case ExceptionEnum.UNPROCESSABLE_ENTITY:
          throw new UnauthorizedException(exception.message);
        default:
          throw exception;
      }
    } catch (error) {
      super.catch(error, host);
    }
  }
}
