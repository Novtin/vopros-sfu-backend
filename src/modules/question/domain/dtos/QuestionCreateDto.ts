import { OmitType } from '@nestjs/swagger';
import { QuestionSaveDto } from './QuestionSaveDto';
import { TagModel } from '../../../tag/domain/models/TagModel';

export class QuestionCreateDto extends OmitType(QuestionSaveDto, [
  'tagNames',
] as const) {
  tags: TagModel[];

  authorId: number;
}
