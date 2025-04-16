import { EntitySchema } from 'typeorm';
import { AnswerRatingModel } from '../../domain/models/AnswerRatingModel';

export const AnswerRatingEntity = new EntitySchema<AnswerRatingModel>({
  name: 'answer_rating',
  tableName: 'answer_rating',
  columns: {
    answerId: {
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
      columns: ['answerId', 'userId'],
    },
  ],
  checks: [
    {
      expression: '"value" IN (-1, 1)',
    },
  ],
  relations: {
    answer: {
      type: 'many-to-one',
      target: 'answer',
      joinColumn: {
        name: 'answerId',
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
