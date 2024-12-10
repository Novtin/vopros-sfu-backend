import { EntitySchema } from 'typeorm';
import { FileModel } from '../../domain/models/file.model';
import { AbstractTimeEntity } from '../../../../common/entities/abstract-time.entity';

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
    ...AbstractTimeEntity,
  },
});
