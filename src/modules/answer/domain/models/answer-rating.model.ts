import { UserModel } from '../../../user/domain/models/user.model';
import { AnswerModel } from './answer.model';

export class AnswerRatingModel {
  id: number;

  answer: AnswerModel;

  answerId: number;

  user: UserModel;

  userId: number;

  value: number;
}
