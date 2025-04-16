import { PartialType } from '@nestjs/swagger';
import { AnswerRatingCreateDto } from './AnswerRatingCreateDto';

export class AnswerRatingSearchDto extends PartialType(AnswerRatingCreateDto) {}
