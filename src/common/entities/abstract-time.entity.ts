import { EntitySchemaColumnOptions } from 'typeorm';

export const AbstractTimeEntity = {
  createdAt: {
    name: 'createdAt',
    createDate: true,
  } as EntitySchemaColumnOptions,
  updatedAt: {
    name: 'updatedAt',
    updateDate: true,
  } as EntitySchemaColumnOptions,
  deletedAt: {
    name: 'deletedAt',
    deleteDate: true,
  } as EntitySchemaColumnOptions,
};
