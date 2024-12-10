import { UserModel } from '../../../user/domain/models/user.model';
import { AbstractTimeModel } from '../../../../common/models/abstract-time.model';
import { FileModel } from '../../../file/domain/models/file.model';
import { QuestionRatingModel } from './question-rating.model';
import { QuestionViewModel } from './question-view.model';
import { TagModel } from '../../../tag/domain/models/tag.model';
import { AnswerModel } from '../../../answer/domain/models/answer.model';

export class QuestionModel extends AbstractTimeModel {
  id: number;

  title: string;

  author: UserModel;

  authorId: number;

  description: string;

  images: FileModel[];

  tags: TagModel[];

  answers: AnswerModel[];

  views: QuestionViewModel[];

  rating: QuestionRatingModel[];
}
