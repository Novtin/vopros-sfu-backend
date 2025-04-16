import { QuestionViewCreateDto } from '../dtos/QuestionViewCreateDto';
import { QuestionViewModel } from '../models/QuestionViewModel';
import { QuestionViewSearchDto } from '../dtos/QuestionViewSearchDto';

export const IQuestionViewRepository = 'IQuestionViewRepository';

export interface IQuestionViewRepository {
  create(dto: QuestionViewCreateDto): Promise<QuestionViewModel>;
  getOneBy(dto: QuestionViewSearchDto): Promise<QuestionViewModel>;
}
