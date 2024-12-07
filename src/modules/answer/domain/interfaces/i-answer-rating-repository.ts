import { CreateAnswerRatingDto } from '../dtos/create-answer-rating.dto';
import { AnswerRatingEntity } from '../entities/answer-rating.entity';
import { SearchAnswerRatingDto } from '../dtos/search-answer-rating.dto';
import { DeleteAnswerRatingDto } from '../dtos/delete-answer-rating.dto';

export const IAnswerRatingRepository = 'IAnswerRatingRepository';

export interface IAnswerRatingRepository {
  create(dto: CreateAnswerRatingDto): Promise<AnswerRatingEntity>;
  getOneBy(dto: SearchAnswerRatingDto): Promise<AnswerRatingEntity>;
  delete(dto: DeleteAnswerRatingDto): Promise<void>;
}
