import { EntitySchema } from 'typeorm';
import { FileModel } from '../../domain/models/FileModel';

export const FileEntity = new EntitySchema<FileModel>({
  name: 'file',
  tableName: 'file',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    size: {
      type: Number,
    },
    mimetype: {
      type: String,
    },
    createdAt: {
      name: 'createdAt',
      createDate: true,
      type: 'timestamp with time zone',
    },
  },
});
