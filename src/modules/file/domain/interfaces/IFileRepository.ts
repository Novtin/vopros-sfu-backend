import { FileSearchDto } from '../dtos/FileSearchDto';
import { FileExistDto } from '../dtos/FileExistDto';
import { FileSaveDto } from '../dtos/FileSaveDto';
import { FileModel } from '../models/FileModel';

export const IFileRepository = 'IFileRepository';

export interface IFileRepository {
  create(dto: FileSaveDto): Promise<FileModel>;
  getOneBy(dto: FileSearchDto): Promise<FileModel>;
  delete(id: number): Promise<void>;
  existBy(dto: FileExistDto): Promise<boolean>;
  getExamples(): Promise<FileModel[]>;
}
