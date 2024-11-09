import { PartialType } from '@nestjs/swagger';
import { CreateQuestionRatingDto } from './create-question-rating.dto';

export class SearchQuestionRatingDto extends PartialType(
  CreateQuestionRatingDto,
) {}
