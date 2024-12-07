import { CreateQuestionRatingDto } from '../dtos/create-question-rating.dto';
import { QuestionRatingEntity } from '../entities/question-rating.entity';
import { SearchQuestionRatingDto } from '../dtos/search-question-rating.dto';
import { DeleteQuestionRatingDto } from '../dtos/delete-question-rating.dto';

export const IQuestionRatingRepository = 'IQuestionRatingRepository';

export interface IQuestionRatingRepository {
  create(dto: CreateQuestionRatingDto): Promise<QuestionRatingEntity>;
  getOneBy(dto: SearchQuestionRatingDto): Promise<QuestionRatingEntity>;
  delete(dto: DeleteQuestionRatingDto): Promise<void>;
}
