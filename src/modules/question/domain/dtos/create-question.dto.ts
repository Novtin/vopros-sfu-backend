import { OmitType } from '@nestjs/swagger';
import { SaveQuestionDto } from './save-question.dto';
import { TagModel } from '../../../tag/domain/models/tag.model';

export class CreateQuestionDto extends OmitType(SaveQuestionDto, [
  'tagNames',
] as const) {
  tags: TagModel[];

  authorId: number;
}
