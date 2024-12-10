import { QuestionModel } from './question.model';
import { UserModel } from '../../../user/domain/models/user.model';

export class QuestionViewModel {
  id: number;

  question: QuestionModel;

  questionId: number;

  user: UserModel;

  userId: number;
}
