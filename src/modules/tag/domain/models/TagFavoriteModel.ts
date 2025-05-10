import { UserModel } from '../../../user/domain/models/UserModel';
import { TagModel } from './TagModel';

export class TagFavoriteModel {
  tagId: number;

  userId: number;

  user: UserModel;

  tag: TagModel;
}
