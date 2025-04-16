import { AnswerSearchDto } from '../dtos/AnswerSearchDto';
import { AnswerExistDto } from '../dtos/AnswerExistDto';
import { AnswerUpdateDto } from '../dtos/AnswerUpdateDto';
import { AnswerCreateDto } from '../dtos/AnswerCreateDto';
import { AnswerModel } from '../models/AnswerModel';

export const IAnswerRepository = 'IAnswerRepository';

export interface IAnswerRepository {
  create(dto: AnswerCreateDto): Promise<AnswerModel>;
  getOneBy(dto: AnswerSearchDto): Promise<AnswerModel>;
  existBy(dto: AnswerExistDto): Promise<boolean>;
  search(dto: AnswerSearchDto): Promise<[AnswerModel[], number]>;
  delete(id: number): Promise<void>;
  update(id: number, dto: AnswerUpdateDto): Promise<AnswerModel>;
  setSolution(id: number): Promise<void>;
  deleteSolution(id: number): Promise<void>;
}
