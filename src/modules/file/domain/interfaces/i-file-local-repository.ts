import { FileModel } from '../models/file.model';

export const IFileLocalRepository = 'IFileLocalRepository';

export interface IFileLocalRepository {
  delete(fileName: string): void;
  getReadStream(fileModel: FileModel, isExample: boolean): any;
}
