import { UserModel } from '../../../user/domain/models/UserModel';
import { AnswerModel } from './AnswerModel';

export class AnswerRatingModel {
  answer: AnswerModel;

  answerId: number;

  user: UserModel;

  userId: number;

  value: number;
}
