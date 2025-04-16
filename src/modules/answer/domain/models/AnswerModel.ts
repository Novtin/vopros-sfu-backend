import { QuestionModel } from '../../../question/domain/models/QuestionModel';
import { UserModel } from '../../../user/domain/models/UserModel';
import { AbstractTimeModel } from '../../../global/domain/models/AbstractTimeModel';
import { AnswerRatingModel } from './AnswerRatingModel';

export class AnswerModel extends AbstractTimeModel {
  id: number;

  question: QuestionModel;

  questionId: number;

  author: UserModel;

  authorId: number;

  text: string;

  isSolution: boolean;

  rating: AnswerRatingModel[];
}
