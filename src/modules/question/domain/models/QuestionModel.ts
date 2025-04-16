import { UserModel } from '../../../user/domain/models/UserModel';
import { AbstractTimeModel } from '../../../global/domain/models/AbstractTimeModel';
import { FileModel } from '../../../file/domain/models/FileModel';
import { QuestionRatingModel } from './QuestionRatingModel';
import { QuestionViewModel } from './QuestionViewModel';
import { TagModel } from '../../../tag/domain/models/TagModel';
import { AnswerModel } from '../../../answer/domain/models/AnswerModel';

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
