import { SaveQuestionDto } from './save-question.dto';
import { PartialType } from '@nestjs/swagger';
import { FileEntity } from '../../../file/domain/entities/file.entity';

export class UpdateQuestionDto extends PartialType(SaveQuestionDto) {
  images: FileEntity[];
}
