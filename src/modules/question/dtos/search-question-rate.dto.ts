import { PartialType } from '@nestjs/swagger';
import { CreateQuestionRateDto } from './create-question-rate.dto';

export class SearchQuestionRateDto extends PartialType(CreateQuestionRateDto) {}
