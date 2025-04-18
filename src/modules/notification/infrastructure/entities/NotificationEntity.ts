import { EntitySchema } from 'typeorm';
import { NotificationModel } from '../../domain/models/NotificationModel';

export const NotificationEntity = new EntitySchema<NotificationModel>({
  name: 'notification',
  tableName: 'notification',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    userId: {
      type: 'int',
    },
    payload: {
      type: 'jsonb',
    },
    isViewed: {
      type: 'boolean',
      default: false,
    },
    createdAt: {
      type: 'timestamp with time zone',
      createDate: true,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'user',
    },
  },
});
