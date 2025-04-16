import { FileModel } from '../models/FileModel';
import { FileStreamDto } from '../dtos/FileStreamDto';

export const IFileStorageRepository = 'IFileStorageRepository';

export interface IFileStorageRepository {
  delete(fileName: string): void;
  getReadStream(fileModel: FileModel, dto: FileStreamDto): any;
}
