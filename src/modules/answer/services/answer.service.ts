import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AnswerRepository } from '../repositories/answer.repository';
import { SaveAnswerDto } from '../dtos/save-answer.dto';
import { QuestionService } from '../../question/services/question.service';
import { ExistAnswerDto } from '../dtos/exist-answer.dto';
import { SearchAnswerDto } from '../dtos/search-answer.dto';
import { RoleEnum } from '../../user/enum/role.enum';
import { ContextDto } from '../../auth/dtos/context.dto';
import { UpdateAnswerDto } from '../dtos/update-answer.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AnswerService {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly questionService: QuestionService,
  ) {}

  async create(authorId: number, dto: SaveAnswerDto) {
    await this.questionService.throwNotFoundExceptionIfNotExist({
      id: dto.questionId,
    });
    return this.answerRepository.create({
      ...dto,
      authorId,
    });
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
    )?.[0];
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
    )?.[0];
    if (!solutionAnswer) {
      throw new ConflictException('Вопрос ещё не решён');
    }
    await this.deleteSolution(solutionAnswer.id);
  }

  async setSolution(id: number) {
    await this.throwNotFoundExceptionIfNotExist({ id });
    return this.answerRepository.setSolution(id);
  }

  async deleteSolution(id: number) {
    await this.throwNotFoundExceptionIfNotExist({ id });
    return this.answerRepository.deleteSolution(id);
  }
}