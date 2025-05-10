import { EntitySchema } from 'typeorm';
import { TagFavoriteModel } from '../../domain/models/TagFavoriteModel';

export const TagFavoriteEntity = new EntitySchema<TagFavoriteModel>({
  name: 'tag_favorite',
  tableName: 'tag_favorite',
  columns: {
    tagId: {
      type: 'int',
      primary: true,
    },
    userId: {
      type: 'int',
      primary: true,
    },
  },
  uniques: [
    {
      columns: ['tagId', 'userId'],
    },
  ],
  relations: {
    tag: {
      type: 'many-to-one',
      target: 'tag',
      joinColumn: {
        name: 'tagId',
      },
    },
    user: {
      type: 'many-to-one',
      target: 'user',
      joinColumn: {
        name: 'userId',
      },
    },
  },
});
