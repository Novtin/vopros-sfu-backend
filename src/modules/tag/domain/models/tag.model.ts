import { AbstractTimeModel } from '../../../global/domain/models/abstract-time.model';
import { QuestionModel } from '../../../question/domain/models/question.model';

export class TagModel extends AbstractTimeModel {
  id: number;

  name: string;

  questions: QuestionModel[];
}
