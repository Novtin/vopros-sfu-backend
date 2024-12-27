import { CreateQuestionDto } from '../dtos/create-question.dto';
import { QuestionModel } from '../models/question.model';
import { ExistQuestionDto } from '../dtos/exist-question.dto';
import { SearchQuestionDto } from '../dtos/search-question.dto';

export const IQuestionRepository = 'IQuestionRepository';

export interface IQuestionRepository {
  create(dto: CreateQuestionDto): Promise<QuestionModel>;
  getOneBy(dto: Partial<QuestionModel>): Promise<QuestionModel>;
  existBy(dto: ExistQuestionDto): Promise<boolean>;
  update(id: number, dto: Partial<QuestionModel>): Promise<QuestionModel>;
  search(dto: SearchQuestionDto): Promise<[QuestionModel[], number]>;
  getCountQuestions(): Promise<number>;
  delete(id: number): Promise<void>;
}
