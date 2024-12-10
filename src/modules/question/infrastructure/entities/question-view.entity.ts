import { EntitySchema } from 'typeorm';
import { QuestionViewModel } from '../../domain/models/question-view.model';

export const QuestionViewEntity = new EntitySchema<QuestionViewModel>({
  name: 'question_view',
  tableName: 'question_view',
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
