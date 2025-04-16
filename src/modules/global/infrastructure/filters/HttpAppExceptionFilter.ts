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
import { AppException } from '../../domain/exceptions/AppException';
import { ExceptionEnum } from '../../domain/enums/ExceptionEnum';
import { BaseExceptionFilter } from '@nestjs/core';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Catch(AppException)
export class HttpAppExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: AppException, host: ArgumentsHost) {
    let httpException: HttpException;
    switch (exception.type) {
      case ExceptionEnum.FORBIDDEN:
        httpException = new ForbiddenException(exception.message);
        break;
      case ExceptionEnum.NOT_FOUND:
        httpException = new NotFoundException(exception.message);
        break;
      case ExceptionEnum.BAD_REQUEST:
        httpException = new BadRequestException(exception.message);
        break;
      case ExceptionEnum.CONFLICT:
        httpException = new ConflictException(exception.message);
        break;
      case ExceptionEnum.UNAUTHORIZED:
        httpException = new UnauthorizedException(exception.message);
        break;
      case ExceptionEnum.UNPROCESSABLE_ENTITY:
        httpException = new UnauthorizedException(exception.message);
        break;
      default:
        throw exception;
    }
    super.catch(httpException, host);
  }
}
