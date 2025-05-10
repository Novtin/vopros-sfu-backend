import { Inject, Injectable } from '@nestjs/common';
import { QuestionRatingCreateDto } from '../dtos/QuestionRatingCreateDto';
import { QuestionRatingDeleteDto } from '../dtos/QuestionRatingDeleteDto';
import { IQuestionRepository } from '../interfaces/IQuestionRepository';
import { NotFoundException } from '../../../global/domain/exceptions/NotFoundException';
import { ConflictException } from '../../../global/domain/exceptions/ConflictException';
import { QuestionService } from './QuestionService';
import { IQuestionRatingRepository } from '../interfaces/IQuestionRatingRepository';

@Injectable()
export class QuestionRatingService {
  constructor(
    @Inject(IQuestionRepository)
    private readonly questionRepository: IQuestionRepository,
    @Inject(IQuestionRatingRepository)
    private readonly questionRatingRepository: IQuestionRatingRepository,
    private readonly questionService: QuestionService,
  ) {}

  async setRating(dto: QuestionRatingCreateDto) {
    await this.questionService.throwNotFoundExceptionIfNotExist({
      id: dto.questionId,
    });
    const rate = await this.questionRatingRepository.getOneBy({
      questionId: dto.questionId,
      userId: dto.userId,
    });
    if (rate?.value === dto.value) {
      throw new ConflictException('Вопрос уже так оценён пользователем');
    }
    await this.questionRatingRepository.create(dto);
    return this.questionRepository.getOneBy({ id: dto.questionId });
  }

  async deleteRating(dto: QuestionRatingDeleteDto) {
    await this.questionService.throwNotFoundExceptionIfNotExist({
      id: dto.questionId,
    });
    const rate = await this.questionRatingRepository.getOneBy({
      questionId: dto.questionId,
      userId: dto.userId,
      value: dto.value,
    });
    if (!rate) {
      throw new NotFoundException('Оценка не найдена');
    }
    await this.questionRatingRepository.delete(dto);
  }
}
