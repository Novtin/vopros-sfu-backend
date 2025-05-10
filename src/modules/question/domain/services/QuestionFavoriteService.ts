import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '../../../global/domain/exceptions/NotFoundException';
import { ConflictException } from '../../../global/domain/exceptions/ConflictException';
import { QuestionService } from './QuestionService';
import { QuestionFavoriteCreateDto } from '../dtos/QuestionFavoriteCreateDto';
import { QuestionFavoriteDeleteDto } from '../dtos/QuestionFavoriteDeleteDto';
import { IQuestionFavoriteRepository } from '../interfaces/IQuestionFavoriteRepository';

@Injectable()
export class QuestionFavoriteService {
  constructor(
    @Inject(IQuestionFavoriteRepository)
    private readonly questionFavoriteRepository: IQuestionFavoriteRepository,
    private readonly questionService: QuestionService,
  ) {}

  async setFavorite(dto: QuestionFavoriteCreateDto) {
    await this.questionService.throwNotFoundExceptionIfNotExist({
      id: dto.questionId,
    });
    const favorite = await this.questionFavoriteRepository.getOneBy({
      questionId: dto.questionId,
      userId: dto.userId,
    });
    if (favorite) {
      throw new ConflictException('Вопрос уже добавлен в избранное');
    }
    await this.questionFavoriteRepository.create(dto);
  }

  async deleteFavorite(dto: QuestionFavoriteDeleteDto) {
    await this.questionService.throwNotFoundExceptionIfNotExist({
      id: dto.questionId,
    });
    const favorite = await this.questionFavoriteRepository.getOneBy({
      questionId: dto.questionId,
      userId: dto.userId,
    });
    if (!favorite) {
      throw new NotFoundException('Вопрос не найден в избранном');
    }
    await this.questionFavoriteRepository.delete(dto);
  }
}
