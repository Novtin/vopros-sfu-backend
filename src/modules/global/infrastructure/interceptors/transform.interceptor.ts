import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Optional,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  constructor(@Optional() private readonly classToTransform: Type<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const isArrayWithPagination =
          Array.isArray(data) && Array.isArray(data[0]);
        const result = plainToInstance(
          this.classToTransform,
          isArrayWithPagination ? data[0] : data,
          {
            strategy: 'excludeAll',
          },
        );
        return isArrayWithPagination
          ? {
              items: result,
              total: data[1],
            }
          : result;
      }),
    );
  }
}
