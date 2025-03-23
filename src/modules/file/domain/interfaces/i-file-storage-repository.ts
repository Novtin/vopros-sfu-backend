import { FileModel } from '../models/file.model';
import { StreamFileDto } from '../dtos/stream-file.dto';

export const IFileStorageRepository = 'IFileStorageRepository';

export interface IFileStorageRepository {
  delete(fileName: string): void;
  getReadStream(fileModel: FileModel, dto: StreamFileDto): any;
}
