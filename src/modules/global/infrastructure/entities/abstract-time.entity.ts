import { EntitySchemaColumnOptions } from 'typeorm';

export const AbstractTimeEntity = {
  createdAt: {
    name: 'createdAt',
    createDate: true,
    type: 'time with time zone',
  } as EntitySchemaColumnOptions,
  updatedAt: {
    name: 'updatedAt',
    updateDate: true,
    type: 'time with time zone',
  } as EntitySchemaColumnOptions,
  deletedAt: {
    name: 'deletedAt',
    deleteDate: true,
    type: 'time with time zone',
  } as EntitySchemaColumnOptions,
};
