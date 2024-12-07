import { FileEntity } from '../entities/file.entity';
import { SearchFileDto } from '../dtos/search-file.dto';
import { ExistFileDto } from '../dtos/exist-file.dto';
import { SaveFileDto } from '../dtos/save-file.dto';

export const IFileRepository = 'IFileRepository';

export interface IFileRepository {
  create(dto: SaveFileDto): Promise<FileEntity>;
  getOneBy(dto: SearchFileDto): Promise<FileEntity>;
  delete(id: number): Promise<void>;
  existBy(dto: ExistFileDto): Promise<boolean>;
}
