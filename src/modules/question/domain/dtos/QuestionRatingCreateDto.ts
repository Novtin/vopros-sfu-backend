import { RatingValueEnum } from '../../../global/domain/enums/RatingValueEnum';

export class QuestionRatingCreateDto {
  userId: number;
  questionId: number;
  value: RatingValueEnum;
}
