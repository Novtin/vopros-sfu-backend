import { CreateAnswerRatingDto } from '../dtos/create-answer-rating.dto';
import { AnswerRatingModel } from '../models/answer-rating.model';
import { SearchAnswerRatingDto } from '../dtos/search-answer-rating.dto';
import { DeleteAnswerRatingDto } from '../dtos/delete-answer-rating.dto';

export const IAnswerRatingRepository = 'IAnswerRatingRepository';

export interface IAnswerRatingRepository {
  create(dto: CreateAnswerRatingDto): Promise<AnswerRatingModel>;
  getOneBy(dto: SearchAnswerRatingDto): Promise<AnswerRatingModel>;
  delete(dto: DeleteAnswerRatingDto): Promise<void>;
}
