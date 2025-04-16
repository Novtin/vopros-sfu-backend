import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from '../interceptors/TransformInterceptor';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiOkPagination } from './ApiOkPagination';

export const SchemaTransform = (
  classToTransform: any,
  params?: { isPagination: boolean },
) =>
  applyDecorators(
    params?.isPagination
      ? ApiOkPagination({ type: classToTransform })
      : ApiOkResponse({ type: classToTransform }),
    UseInterceptors(new TransformInterceptor(classToTransform)),
  );
