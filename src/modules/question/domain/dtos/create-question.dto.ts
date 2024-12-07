import { OmitType } from '@nestjs/swagger';
import { SaveQuestionDto } from './save-question.dto';
import { TagEntity } from '../../../tag/domain/entities/tag.entity';

export class CreateQuestionDto extends OmitType(SaveQuestionDto, [
  'tagNames',
] as const) {
  tags: TagEntity[];

  authorId: number;
}
