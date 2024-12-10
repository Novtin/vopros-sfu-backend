import { CreateQuestionFavoriteDto } from '../dtos/create-question-favorite.dto';
import { QuestionFavoriteModel } from '../models/question-favorite.model';
import { SearchQuestionFavoriteDto } from '../dtos/search-question-favorite.dto';
import { DeleteQuestionFavoriteDto } from '../dtos/delete-question-favorite.dto';

export const IQuestionFavoriteRepository = 'IQuestionFavoriteRepository';

export interface IQuestionFavoriteRepository {
  create(dto: CreateQuestionFavoriteDto): Promise<QuestionFavoriteModel>;
  getOneBy(dto: SearchQuestionFavoriteDto): Promise<QuestionFavoriteModel>;
  delete(dto: DeleteQuestionFavoriteDto): Promise<void>;
}
