import { QuestionModel } from './QuestionModel';
import { UserModel } from '../../../user/domain/models/UserModel';

export class QuestionFavoriteModel {
  question: QuestionModel;

  questionId: number;

  user: UserModel;

  userId: number;
}
