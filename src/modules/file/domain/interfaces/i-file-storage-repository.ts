import { FileModel } from '../models/file.model';

export const IFileStorageRepository = 'IFileStorageRepository';

export interface IFileStorageRepository {
  delete(fileName: string): void;
  getReadStream(fileModel: FileModel, isExample: boolean): any;
}
