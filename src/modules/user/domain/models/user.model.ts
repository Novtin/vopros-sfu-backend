import { RoleModel } from './role.model';
import { QuestionModel } from '../../../question/domain/models/question.model';
import { AnswerModel } from '../../../answer/domain/models/answer.model';
import { AbstractTimeModel } from '../../../global/domain/models/abstract-time.model';
import { FileModel } from '../../../file/domain/models/file.model';

export class UserModel extends AbstractTimeModel {
  id: number;

  email: string;

  nickname: string;

  passwordHash: string;

  description: string;

  isConfirmed: boolean;

  emailHash: string;

  roles: RoleModel[];

  avatar: FileModel;

  avatarId: number;

  questions: QuestionModel[];

  answers: AnswerModel[];

  rating: number;
}
