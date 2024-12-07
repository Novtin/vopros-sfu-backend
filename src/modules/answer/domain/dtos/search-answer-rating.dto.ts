import { PartialType } from '@nestjs/swagger';
import { CreateAnswerRatingDto } from './create-answer-rating.dto';

export class SearchAnswerRatingDto extends PartialType(CreateAnswerRatingDto) {}
