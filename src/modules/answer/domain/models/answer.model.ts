import { QuestionModel } from '../../../question/domain/models/question.model';
import { UserModel } from '../../../user/domain/models/user.model';
import { AnswerRatingModel } from './answer-rating.model';
import { AbstractTimeModel } from '../../../global/domain/models/abstract-time.model';

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
