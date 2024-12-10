import { CreateQuestionViewDto } from '../dtos/create-question-view.dto';
import { QuestionViewModel } from '../models/question-view.model';
import { SearchQuestionViewDto } from '../dtos/search-question-view.dto';

export const IQuestionViewRepository = 'IQuestionViewRepository';

export interface IQuestionViewRepository {
  create(dto: CreateQuestionViewDto): Promise<QuestionViewModel>;
  getOneBy(dto: SearchQuestionViewDto): Promise<QuestionViewModel>;
}
