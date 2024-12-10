import { SearchFileDto } from '../dtos/search-file.dto';
import { ExistFileDto } from '../dtos/exist-file.dto';
import { SaveFileDto } from '../dtos/save-file.dto';
import { FileModel } from '../models/file.model';

export const IFileRepository = 'IFileRepository';

export interface IFileRepository {
  create(dto: SaveFileDto): Promise<FileModel>;
  getOneBy(dto: SearchFileDto): Promise<FileModel>;
  delete(id: number): Promise<void>;
  existBy(dto: ExistFileDto): Promise<boolean>;
}
