import { UserModel } from '../../../user/domain/models/user.model';
import { AnswerModel } from './answer.model';

export class AnswerRatingModel {
  answer: AnswerModel;

  answerId: number;

  user: UserModel;

  userId: number;

  value: number;
}
