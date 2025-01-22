import { CreateQuestionDto } from '../dtos/create-question.dto';
import { QuestionModel } from '../models/question.model';
import { ExistQuestionDto } from '../dtos/exist-question.dto';
import { SearchQuestionDto } from '../dtos/search-question.dto';
import { IQuestionCount } from './i-question-count';

export const IQuestionRepository = 'IQuestionRepository';

export interface IQuestionRepository {
  create(dto: CreateQuestionDto): Promise<QuestionModel>;
  getOneBy(dto: Partial<QuestionModel>): Promise<QuestionModel>;
  existBy(dto: ExistQuestionDto): Promise<boolean>;
  update(id: number, dto: Partial<QuestionModel>): Promise<QuestionModel>;
  search(dto: SearchQuestionDto): Promise<[QuestionModel[], number]>;
  getCountQuestions(): Promise<IQuestionCount>;
  delete(id: number): Promise<void>;
}
