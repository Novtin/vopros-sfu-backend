import { CreateAnswerDto } from '../dtos/create-answer.dto';
import { AnswerModel } from '../models/answer.model';
import { SearchAnswerDto } from '../dtos/search-answer.dto';
import { ExistAnswerDto } from '../dtos/exist-answer.dto';
import { UpdateAnswerDto } from '../dtos/update-answer.dto';

export const IAnswerRepository = 'IAnswerRepository';

export interface IAnswerRepository {
  create(dto: CreateAnswerDto): Promise<AnswerModel>;
  getOneBy(dto: SearchAnswerDto): Promise<AnswerModel>;
  existBy(dto: ExistAnswerDto): Promise<boolean>;
  search(dto: SearchAnswerDto): Promise<[AnswerModel[], number]>;
  delete(id: number): Promise<void>;
  update(id: number, dto: UpdateAnswerDto): Promise<AnswerModel>;
  setSolution(id: number): Promise<void>;
  deleteSolution(id: number): Promise<void>;
}
