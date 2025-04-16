import { AnswerRatingSearchDto } from '../dtos/AnswerRatingSearchDto';
import { AnswerRatingCreateDto } from '../dtos/AnswerRatingCreateDto';
import { AnswerRatingDeleteDto } from '../dtos/AnswerRatingDeleteDto';
import { AnswerRatingModel } from '../models/AnswerRatingModel';

export const IAnswerRatingRepository = 'IAnswerRatingRepository';

export interface IAnswerRatingRepository {
  create(dto: AnswerRatingCreateDto): Promise<AnswerRatingModel>;
  getOneBy(dto: AnswerRatingSearchDto): Promise<AnswerRatingModel>;
  delete(dto: AnswerRatingDeleteDto): Promise<void>;
}
