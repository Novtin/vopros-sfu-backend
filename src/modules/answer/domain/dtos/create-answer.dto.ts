import { SaveAnswerDto } from './save-answer.dto';

export class CreateAnswerDto extends SaveAnswerDto {
  authorId: number;
}
