import { SaveQuestionDto } from './save-question.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateQuestionDto extends PartialType(SaveQuestionDto) {}
