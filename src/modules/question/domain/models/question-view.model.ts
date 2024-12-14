import { QuestionModel } from './question.model';
import { UserModel } from '../../../user/domain/models/user.model';

export class QuestionViewModel {
  question: QuestionModel;

  questionId: number;

  user: UserModel;

  userId: number;
}
