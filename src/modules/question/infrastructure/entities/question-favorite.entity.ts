import { EntitySchema } from 'typeorm';
import { QuestionFavoriteModel } from '../../domain/models/question-favorite.model';

export const QuestionFavoriteEntity = new EntitySchema<QuestionFavoriteModel>({
  name: 'question_favorite',
  tableName: 'question_favorite',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    questionId: {
      type: 'int',
    },
    userId: {
      type: 'int',
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
