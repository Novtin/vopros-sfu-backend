import { TagFavoriteModel } from '../models/TagFavoriteModel';

export const ITagFavoriteRepository = 'ITagFavoriteRepository';

export interface ITagFavoriteRepository {
  search(dto: Partial<TagFavoriteModel>): Promise<TagFavoriteModel[]>;
  delete(dto: Partial<TagFavoriteModel>): Promise<void>;
  create(dto: Partial<TagFavoriteModel>): Promise<TagFavoriteModel>;
}
