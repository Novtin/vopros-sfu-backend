import { AbstractTimeModel } from '../../../../common/models/abstract-time.model';

export class FileModel extends AbstractTimeModel {
  id: number;

  name: string;

  size: number;

  mimetype: string;
}
