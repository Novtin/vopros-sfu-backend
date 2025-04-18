import { QuestionSaveDto } from './QuestionSaveDto';
import { PartialType } from '@nestjs/swagger';
import { FileModel } from '../../../file/domain/models/FileModel';

export class QuestionUpdateDto extends PartialType(QuestionSaveDto) {
  images?: FileModel[];
}
