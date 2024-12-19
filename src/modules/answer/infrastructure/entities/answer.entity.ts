import { EntitySchema } from 'typeorm';
import { AnswerModel } from '../../domain/models/answer.model';
import { AbstractTimeEntity } from '../../../global/infrastructure/entities/abstract-time.entity';

export const AnswerEntity = new EntitySchema<AnswerModel>({
  name: 'answer',
  tableName: 'answer',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    questionId: {
      type: 'int',
    },
    authorId: {
      type: 'int',
    },
    text: {
      type: 'varchar',
    },
    isSolution: {
      type: 'boolean',
      default: false,
    },
    ...AbstractTimeEntity,
  },
  relations: {
    question: {
      type: 'many-to-one',
      target: 'question',
      joinColumn: {
        name: 'questionId',
      },
      inverseSide: 'answers',
    },
    author: {
      type: 'many-to-one',
      target: 'user',
      joinColumn: {
        name: 'authorId',
      },
    },
    rating: {
      type: 'one-to-many',
      target: 'answer_rating',
      inverseSide: 'answer',
    },
  },
});
