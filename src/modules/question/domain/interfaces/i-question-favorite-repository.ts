import { CreateQuestionFavoriteDto } from '../dtos/create-question-favorite.dto';
import { QuestionFavoriteEntity } from '../entities/question-favorite.entity';
import { SearchQuestionFavoriteDto } from '../dtos/search-question-favorite.dto';
import { DeleteQuestionFavoriteDto } from '../dtos/delete-question-favorite.dto';

export const IQuestionFavoriteRepository = 'IQuestionFavoriteRepository';

export interface IQuestionFavoriteRepository {
  create(dto: CreateQuestionFavoriteDto): Promise<QuestionFavoriteEntity>;
  getOneBy(dto: SearchQuestionFavoriteDto): Promise<QuestionFavoriteEntity>;
  delete(dto: DeleteQuestionFavoriteDto): Promise<void>;
}
