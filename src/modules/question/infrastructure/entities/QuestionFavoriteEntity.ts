import { EntitySchema } from 'typeorm';
import { QuestionFavoriteModel } from '../../domain/models/QuestionFavoriteModel';

export const QuestionFavoriteEntity = new EntitySchema<QuestionFavoriteModel>({
  name: 'question_favorite',
  tableName: 'question_favorite',
  columns: {
    questionId: {
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
      columns: ['questionId', 'userId'],
    },
  ],
  relations: {
    question: {
      type: 'many-to-one',
      target: 'question',
      joinColumn: {
        name: 'questionId',
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
