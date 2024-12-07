import { CreateQuestionDto } from '../dtos/create-question.dto';
import { QuestionEntity } from '../entities/question.entity';
import { ExistQuestionDto } from '../dtos/exist-question.dto';
import { UpdateQuestionDto } from '../dtos/update-question.dto';
import { SearchQuestionDto } from '../dtos/search-question.dto';

export const IQuestionRepository = 'IQuestionRepository';

export interface IQuestionRepository {
  create(dto: CreateQuestionDto): Promise<QuestionEntity>;
  getOneBy(dto: Partial<QuestionEntity>): Promise<QuestionEntity>;
  existBy(dto: ExistQuestionDto): Promise<boolean>;
  update(id: number, dto: UpdateQuestionDto): Promise<QuestionEntity>;
  search(dto: SearchQuestionDto): Promise<[QuestionEntity[], number]>;
  getCountQuestions(): Promise<number>;
  delete(id: number): Promise<void>;
}
