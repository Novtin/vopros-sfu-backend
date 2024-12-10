import { EntitySchema } from 'typeorm';
import { TagModel } from '../../domain/models/tag.model';
import { AbstractTimeEntity } from '../../../../common/entities/abstract-time.entity';

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
