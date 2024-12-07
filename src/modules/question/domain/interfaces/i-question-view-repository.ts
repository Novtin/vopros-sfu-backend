import { CreateQuestionViewDto } from '../dtos/create-question-view.dto';
import { QuestionViewEntity } from '../entities/question-view.entity';
import { SearchQuestionViewDto } from '../dtos/search-question-view.dto';

export const IQuestionViewRepository = 'IQuestionViewRepository';

export interface IQuestionViewRepository {
  create(dto: CreateQuestionViewDto): Promise<QuestionViewEntity>;
  getOneBy(dto: SearchQuestionViewDto): Promise<QuestionViewEntity>;
}
