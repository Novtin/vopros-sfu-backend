import { EntitySchema } from 'typeorm';
import { AnswerRatingModel } from '../../domain/models/answer-rating.model';

export const AnswerRatingEntity = new EntitySchema<AnswerRatingModel>({
  name: 'answer_rating',
  tableName: 'answer_rating',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    answerId: {
      type: 'int',
    },
    userId: {
      type: 'int',
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
