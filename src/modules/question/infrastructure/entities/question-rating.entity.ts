import { EntitySchema } from 'typeorm';
import { QuestionRatingModel } from '../../domain/models/question-rating.model';

export const QuestionRatingEntity = new EntitySchema<QuestionRatingModel>({
  name: 'question_rating',
  tableName: 'question_rating',
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
