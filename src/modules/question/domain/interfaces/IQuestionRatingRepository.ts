import { QuestionRatingCreateDto } from '../dtos/QuestionRatingCreateDto';
import { QuestionRatingModel } from '../models/QuestionRatingModel';
import { QuestionRatingSearchDto } from '../dtos/QuestionRatingSearchDto';
import { QuestionRatingDeleteDto } from '../dtos/QuestionRatingDeleteDto';

export const IQuestionRatingRepository = 'IQuestionRatingRepository';

export interface IQuestionRatingRepository {
  create(dto: QuestionRatingCreateDto): Promise<QuestionRatingModel>;
  getOneBy(dto: QuestionRatingSearchDto): Promise<QuestionRatingModel>;
  delete(dto: QuestionRatingDeleteDto): Promise<void>;
}
