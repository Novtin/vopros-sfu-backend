import { RoleModel } from './RoleModel';
import { QuestionModel } from '../../../question/domain/models/QuestionModel';
import { AbstractTimeModel } from '../../../global/domain/models/AbstractTimeModel';
import { FileModel } from '../../../file/domain/models/FileModel';
import { QuestionFavoriteModel } from '../../../question/domain/models/QuestionFavoriteModel';
import { AnswerModel } from '../../../answer/domain/models/AnswerModel';
import { TagFavoriteModel } from '../../../tag/domain/models/TagFavoriteModel';

export class UserModel extends AbstractTimeModel {
  id: number;

  email: string;

  nickname: string;

  passwordHash: string;

  description: string;

  isConfirmed: boolean;

  roles: RoleModel[];

  avatar: FileModel;

  avatarId: number;

  questions: QuestionModel[];

  questionsFavorite: QuestionFavoriteModel[];

  tagsFavorite: TagFavoriteModel[];

  answers: AnswerModel[];

  rating: number;

  isOnline: boolean;

  wasOnlineAt: Date;
}
