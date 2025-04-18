import { QuestionCreateDto } from '../dtos/QuestionCreateDto';
import { QuestionModel } from '../models/QuestionModel';
import { QuestionExistDto } from '../dtos/QuestionExistDto';
import { QuestionSearchDto } from '../dtos/QuestionSearchDto';
import { IQuestionCount } from './IQuestionCount';

export const IQuestionRepository = 'IQuestionRepository';

export interface IQuestionRepository {
  create(dto: QuestionCreateDto): Promise<QuestionModel>;
  getOneBy(dto: Partial<QuestionModel>): Promise<QuestionModel>;
  existBy(dto: QuestionExistDto): Promise<boolean>;
  update(id: number, dto: Partial<QuestionModel>): Promise<QuestionModel>;
  search(dto: QuestionSearchDto): Promise<[QuestionModel[], number]>;
  getCount(): Promise<IQuestionCount>;
  delete(id: number): Promise<void>;
}
