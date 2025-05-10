import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '../../../global/domain/exceptions/NotFoundException';
import { ConflictException } from '../../../global/domain/exceptions/ConflictException';
import { IAnswerRatingRepository } from '../interfaces/IAnswerRatingRepository';
import { AnswerRatingDeleteDto } from '../dtos/AnswerRatingDeleteDto';
import { AnswerRatingCreateDto } from '../dtos/AnswerRatingCreateDto';
import { AnswerService } from './AnswerService';

@Injectable()
export class AnswerRatingService {
  constructor(
    private readonly answerService: AnswerService,
    @Inject(IAnswerRatingRepository)
    private readonly answerRatingRepository: IAnswerRatingRepository,
  ) {}

  async rate(dto: AnswerRatingCreateDto) {
    await this.answerService.throwNotFoundExceptionIfNotExist({
      id: dto.answerId,
    });
    const rate = await this.answerRatingRepository.getOneBy({
      answerId: dto.answerId,
      userId: dto.userId,
    });
    if (rate?.value === dto.value) {
      throw new ConflictException('Ответ уже так оценён пользователем');
    }
    await this.answerRatingRepository.create(dto);
    return this.answerService.getOneBy({ id: dto.answerId });
  }

  async deleteRate(dto: AnswerRatingDeleteDto) {
    await this.answerService.throwNotFoundExceptionIfNotExist({
      id: dto.answerId,
    });
    const rate = await this.answerRatingRepository.getOneBy({
      answerId: dto.answerId,
      userId: dto.userId,
      value: dto.value,
    });
    if (!rate) {
      throw new NotFoundException('Оценка не найдена');
    }
    await this.answerRatingRepository.delete(dto);
  }
}
