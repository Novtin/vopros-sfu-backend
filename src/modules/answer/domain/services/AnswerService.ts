import { Inject, Injectable } from '@nestjs/common';
import { AnswerSaveDto } from '../dtos/AnswerSaveDto';
import { QuestionService } from '../../../question/domain/services/QuestionService';
import { AnswerExistDto } from '../dtos/AnswerExistDto';
import { AnswerSearchDto } from '../dtos/AnswerSearchDto';
import { RoleEnum } from '../../../user/domain/enums/RoleEnum';
import { ContextDto } from '../../../auth/domain/dtos/ContextDto';
import { AnswerUpdateDto } from '../dtos/AnswerUpdateDto';
import { plainToInstance } from 'class-transformer';
import { IEventEmitterService } from '../../../global/domain/interfaces/IEventEmitterService';
import { EventEnum } from '../../../global/domain/enums/EventEnum';
import { NotFoundException } from '../../../global/domain/exceptions/NotFoundException';
import { ForbiddenException } from '../../../global/domain/exceptions/ForbiddenException';
import { ConflictException } from '../../../global/domain/exceptions/ConflictException';
import { IAnswerRepository } from '../interfaces/IAnswerRepository';
import { IAnswerRatingRepository } from '../interfaces/IAnswerRatingRepository';
import { AnswerRatingDeleteDto } from '../dtos/AnswerRatingDeleteDto';
import { AnswerRatingCreateDto } from '../dtos/AnswerRatingCreateDto';

@Injectable()
export class AnswerService {
  constructor(
    @Inject(IAnswerRepository)
    private readonly answerRepository: IAnswerRepository,
    @Inject(IAnswerRatingRepository)
    private readonly answerRatingRepository: IAnswerRatingRepository,
    @Inject(IEventEmitterService)
    private readonly eventEmitterService: IEventEmitterService,
    private readonly questionService: QuestionService,
  ) {}

  async create(authorId: number, dto: AnswerSaveDto) {
    await this.questionService.throwNotFoundExceptionIfNotExist({
      id: dto.questionId,
    });
    const answer = await this.answerRepository.create({
      ...dto,
      authorId,
    });
    this.eventEmitterService.emit(EventEnum.CREATE_NOTIFICATION, {
      userId: answer.question.authorId,
      payload: {
        questionId: answer.id,
        answerId: answer.id,
        answerAuthorId: answer.authorId,
        message: `Пользователь "${answer.author.nickname}" дал ответ на ваш вопрос "${answer.question.title}"`,
      },
    });
    return answer;
  }

  async getOneBy(dto: AnswerSearchDto) {
    await this.throwNotFoundExceptionIfNotExist(dto);
    return this.answerRepository.getOneBy(dto);
  }

  existBy(dto: AnswerExistDto): Promise<boolean> {
    return this.answerRepository.existBy(dto);
  }

  async throwNotFoundExceptionIfNotExist(dto: AnswerExistDto) {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException();
    }
  }

  search(dto: AnswerSearchDto) {
    return this.answerRepository.search(dto);
  }

  async throwForbiddenExceptionIfNotBelong(authorId: number, answerId: number) {
    if (!(await this.existBy({ authorId, id: answerId }))) {
      throw new ForbiddenException();
    }
  }

  async delete(context: ContextDto, id: number) {
    if (!context.roles.includes(RoleEnum.ADMIN)) {
      await this.throwForbiddenExceptionIfNotBelong(context.userId, id);
    }
    await this.throwNotFoundExceptionIfNotExist({ id });
    return this.answerRepository.delete(id);
  }

  async update(userId: number, id: number, dto: AnswerUpdateDto) {
    await this.throwForbiddenExceptionIfNotBelong(userId, id);
    return this.answerRepository.update(id, dto);
  }

  async resolveQuestion(userId: number, questionId: number, answerId: number) {
    await this.questionService.throwNotFoundExceptionIfNotExist({
      id: questionId,
    });
    await this.questionService.throwForbiddenExceptionIfNotBelong(
      userId,
      questionId,
    );

    const solutionAnswer = (
      await this.search(
        plainToInstance(AnswerSearchDto, { questionId, isSolution: true }),
      )
    )[0][0];
    if (solutionAnswer) {
      throw new ConflictException('Вопрос уже решён');
    }
    await this.setSolution(answerId);
  }

  async deleteResolveQuestion(userId: number, questionId: number) {
    await this.questionService.throwNotFoundExceptionIfNotExist({
      id: questionId,
    });
    await this.questionService.throwForbiddenExceptionIfNotBelong(
      userId,
      questionId,
    );
    const solutionAnswer = (
      await this.search(
        plainToInstance(AnswerSearchDto, { questionId, isSolution: true }),
      )
    )[0][0];
    if (!solutionAnswer) {
      throw new ConflictException('Вопрос ещё не решён');
    }
    await this.deleteSolution(solutionAnswer.id);
  }

  async setSolution(id: number) {
    await this.throwNotFoundExceptionIfNotExist({ id });
    await this.answerRepository.setSolution(id);
  }

  async deleteSolution(id: number) {
    await this.throwNotFoundExceptionIfNotExist({ id });
    return this.answerRepository.deleteSolution(id);
  }

  async rate(dto: AnswerRatingCreateDto) {
    await this.throwNotFoundExceptionIfNotExist({ id: dto.answerId });
    const rate = await this.answerRatingRepository.getOneBy({
      answerId: dto.answerId,
      userId: dto.userId,
    });
    if (rate?.value === dto.value) {
      throw new ConflictException('Ответ уже так оценён пользователем');
    }
    await this.answerRatingRepository.create(dto);
    return this.getOneBy({ id: dto.answerId });
  }

  async deleteRate(dto: AnswerRatingDeleteDto) {
    await this.throwNotFoundExceptionIfNotExist({ id: dto.answerId });
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
