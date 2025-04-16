import { TagSearchDto } from '../dtos/TagSearchDto';
import { TagModel } from '../models/TagModel';
import { TagSaveDto } from '../dtos/TagSaveDto';

export const ITagRepository = 'ITagRepository';

export interface ITagRepository {
  search(dto: TagSearchDto): Promise<[TagModel[], number]>;
  create(dto: TagSaveDto): Promise<TagModel>;
  getOneBy(dto: TagSearchDto): Promise<TagModel>;
}
