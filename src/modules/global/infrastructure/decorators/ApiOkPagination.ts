import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResultPaginationSchema } from '../schemas/ResultPaginationSchema';

interface ApiOkSearchResponseOptions {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  type: Function;
}

export function ApiOkPagination(options: ApiOkSearchResponseOptions) {
  const itemType = options.type;
  return applyDecorators(
    ApiExtraModels(ResultPaginationSchema, itemType),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResultPaginationSchema) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(itemType) },
              },
            },
          },
        ],
      },
    }),
  );
}
