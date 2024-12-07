import { SearchTagDto } from '../dtos/search-tag.dto';
import { TagEntity } from '../entities/tag.entity';
import { SaveTagDto } from '../dtos/save-tag.dto';

export const ITagRepository = 'ITagRepository';

export interface ITagRepository {
  search(dto: SearchTagDto): Promise<TagEntity[]>;
  create(dto: SaveTagDto): Promise<TagEntity>;
  getOneBy(dto: SearchTagDto): Promise<TagEntity>;
}
