import { SaveQuestionDto } from './save-question.dto';
import { PartialType } from '@nestjs/swagger';
import { FileModel } from '../../../file/domain/models/file.model';

export class UpdateQuestionDto extends PartialType(SaveQuestionDto) {
  images: FileModel[];
}
