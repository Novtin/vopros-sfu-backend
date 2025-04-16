import { EntitySchema } from 'typeorm';
import { QuestionRatingModel } from '../../domain/models/QuestionRatingModel';

export const QuestionRatingEntity = new EntitySchema<QuestionRatingModel>({
  name: 'question_rating',
  tableName: 'question_rating',
  columns: {
    questionId: {
      type: 'int',
      primary: true,
    },
    userId: {
      type: 'int',
      primary: true,
    },
    value: {
      type: 'int',
    },
  },
  uniques: [
    {
      columns: ['questionId', 'userId'],
    },
  ],
  checks: [
    {
      expression: '"value" IN (-1, 1)',
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
