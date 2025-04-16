import { QuestionFavoriteCreateDto } from '../dtos/QuestionFavoriteCreateDto';
import { QuestionFavoriteModel } from '../models/QuestionFavoriteModel';
import { QuestionFavoriteSearchDto } from '../dtos/QuestionFavoriteSearchDto';
import { QuestionFavoriteDeleteDto } from '../dtos/QuestionFavoriteDeleteDto';

export const IQuestionFavoriteRepository = 'IQuestionFavoriteRepository';

export interface IQuestionFavoriteRepository {
  create(dto: QuestionFavoriteCreateDto): Promise<QuestionFavoriteModel>;
  getOneBy(dto: QuestionFavoriteSearchDto): Promise<QuestionFavoriteModel>;
  delete(dto: QuestionFavoriteDeleteDto): Promise<void>;
}
