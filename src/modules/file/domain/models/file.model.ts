import { AbstractTimeModel } from '../../../global/domain/models/abstract-time.model';

export class FileModel extends AbstractTimeModel {
  id: number;

  name: string;

  size: number;

  mimetype: string;
}
