import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiOkPagination } from './api-ok-pagination';

export const Transform = (
  classToTransform: any,
  params?: { pagination: boolean },
) =>
  applyDecorators(
    params?.pagination
      ? ApiOkPagination({ type: classToTransform })
      : ApiOkResponse({ type: classToTransform }),
    UseInterceptors(new TransformInterceptor(classToTransform)),
  );
