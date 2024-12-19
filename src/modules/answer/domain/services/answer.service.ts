import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SaveAnswerDto } from '../dtos/save-answer.dto';
import { QuestionService } from '../../../question/domain/services/question.service';
import { ExistAnswerDto } from '../dtos/exist-answer.dto';
import { SearchAnswerDto } from '../dtos/search-answer.dto';
import { RoleEnum } from '../../../user/domain/enum/role.enum';
import { ContextDto } from '../../../auth/domain/dtos/context.dto';
import { UpdateAnswerDto } from '../dtos/update-answer.dto';
import { plainToInstance } from 'class-transformer';
import { CreateAnswerRatingDto } from '../dtos/create-answer-rating.dto';
import { DeleteAnswerRatingDto } from '../dtos/delete-answer-rating.dto';
import { IAnswerRepository } from '../interfaces/i-answer-repository';
import { IAnswerRatingRepository } from '../interfaces/i-answer-rating-repository';
import { IEventEmitterService } from '../../../global/domain/interfaces/i-event-emitter-service';
import { EventEnum } from '../../../global/domain/enums/event.enum';

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

  async create(authorId: number, dto: SaveAnswerDto) {
    await this.questionService.throwNotFoundExceptionIfNotExist({
      id: dto.questionId,
    });
    const answer = await this.answerRepository.create({
      ...dto,
      authorId,
    });
    this.eventEmitterService.emit(EventEnum.SEND_NOTIFICATION, {
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

  async getOneBy(dto: SearchAnswerDto) {
    await this.throwNotFoundExceptionIfNotExist(dto);
    return this.answerRepository.getOneBy(dto);
  }

  existBy(dto: ExistAnswerDto): Promise<boolean> {
    return this.answerRepository.existBy(dto);
  }

  async throwNotFoundExceptionIfNotExist(dto: ExistAnswerDto) {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException();
    }
  }

  search(dto: SearchAnswerDto) {
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

  async update(userId: number, id: number, dto: UpdateAnswerDto) {
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
        plainToInstance(SearchAnswerDto, { questionId, isSolution: true }),
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
        plainToInstance(SearchAnswerDto, { questionId, isSolution: true }),
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

  async rate(dto: CreateAnswerRatingDto) {
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

  async deleteRate(dto: DeleteAnswerRatingDto) {
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
