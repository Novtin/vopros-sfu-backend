import { AnswerSaveDto } from './AnswerSaveDto';

export class AnswerCreateDto extends AnswerSaveDto {
  authorId: number;
}
