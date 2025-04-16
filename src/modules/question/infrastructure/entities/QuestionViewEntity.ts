import { EntitySchema } from 'typeorm';
import { QuestionViewModel } from '../../domain/models/QuestionViewModel';

export const QuestionViewEntity = new EntitySchema<QuestionViewModel>({
  name: 'question_view',
  tableName: 'question_view',
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
