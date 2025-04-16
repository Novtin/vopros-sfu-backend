import { QuestionModel } from './QuestionModel';
import { UserModel } from '../../../user/domain/models/UserModel';

export class QuestionRatingModel {
  question: QuestionModel;

  questionId: number;

  user: UserModel;

  userId: number;

  value: number;
}
