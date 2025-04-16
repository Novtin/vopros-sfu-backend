import { EntitySchema } from 'typeorm';
import { TagModel } from '../../domain/models/TagModel';
import { AbstractTimeEntity } from '../../../global/infrastructure/entities/AbstractTimeEntity';

export const TagEntity = new EntitySchema<TagModel>({
  name: 'tag',
  tableName: 'tag',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
      unique: true,
    },
    ...AbstractTimeEntity,
  },
});
