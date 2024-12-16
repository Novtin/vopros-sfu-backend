import { SearchTagDto } from '../dtos/search-tag.dto';
import { TagModel } from '../models/tag.model';
import { SaveTagDto } from '../dtos/save-tag.dto';

export const ITagRepository = 'ITagRepository';

export interface ITagRepository {
  search(dto: SearchTagDto): Promise<[TagModel[], number]>;
  create(dto: SaveTagDto): Promise<TagModel>;
  getOneBy(dto: SearchTagDto): Promise<TagModel>;
}
