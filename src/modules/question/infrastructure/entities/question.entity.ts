import { EntitySchema } from 'typeorm';
import { QuestionModel } from '../../domain/models/question.model';
import { AbstractTimeEntity } from '../../../../common/entities/abstract-time.entity';

export const QuestionEntity = new EntitySchema<QuestionModel>({
  name: 'question',
  tableName: 'question',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    title: {
      type: 'varchar',
    },
    authorId: {
      type: 'int',
    },
    description: {
      type: 'varchar',
    },
    ...AbstractTimeEntity,
  },
  relations: {
    author: {
      type: 'many-to-one',
      target: 'user',
      joinColumn: {
        name: 'authorId',
      },
    },
    images: {
      type: 'many-to-many',
      target: 'file',
      joinTable: {
        name: 'question_image',
      },
    },
    tags: {
      type: 'many-to-many',
      target: 'tag',
      joinTable: {
        name: 'question_tag',
      },
    },
    answers: {
      type: 'one-to-many',
      target: 'answer',
      inverseSide: 'question',
    },
    views: {
      type: 'one-to-many',
      target: 'question_view',
      inverseSide: 'question',
    },
    rating: {
      type: 'one-to-many',
      target: 'question_rating',
      inverseSide: 'question',
    },
  },
});
