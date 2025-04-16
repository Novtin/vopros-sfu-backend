import { PartialType } from '@nestjs/swagger';
import { QuestionRatingCreateDto } from './QuestionRatingCreateDto';

export class QuestionRatingSearchDto extends PartialType(
  QuestionRatingCreateDto,
) {}
