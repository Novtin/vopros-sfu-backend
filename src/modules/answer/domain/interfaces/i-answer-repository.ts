import { CreateAnswerDto } from '../dtos/create-answer.dto';
import { AnswerEntity } from '../entities/answer.entity';
import { SearchAnswerDto } from '../dtos/search-answer.dto';
import { ExistAnswerDto } from '../dtos/exist-answer.dto';
import { UpdateAnswerDto } from '../dtos/update-answer.dto';

export const IAnswerRepository = 'IAnswerRepository';

export interface IAnswerRepository {
  create(dto: CreateAnswerDto): Promise<AnswerEntity>;
  getOneBy(dto: SearchAnswerDto): Promise<AnswerEntity>;
  existBy(dto: ExistAnswerDto): Promise<boolean>;
  search(dto: SearchAnswerDto): Promise<AnswerEntity[]>;
  delete(id: number): Promise<void>;
  update(id: number, dto: UpdateAnswerDto): Promise<AnswerEntity>;
  setSolution(id: number): Promise<void>;
  deleteSolution(id: number): Promise<void>;
}
