import { CreateQuestionRatingDto } from '../dtos/create-question-rating.dto';
import { QuestionRatingModel } from '../models/question-rating.model';
import { SearchQuestionRatingDto } from '../dtos/search-question-rating.dto';
import { DeleteQuestionRatingDto } from '../dtos/delete-question-rating.dto';

export const IQuestionRatingRepository = 'IQuestionRatingRepository';

export interface IQuestionRatingRepository {
  create(dto: CreateQuestionRatingDto): Promise<QuestionRatingModel>;
  getOneBy(dto: SearchQuestionRatingDto): Promise<QuestionRatingModel>;
  delete(dto: DeleteQuestionRatingDto): Promise<void>;
}
