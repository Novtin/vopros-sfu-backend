import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { DataSource } from 'typeorm';
import {
  refreshDatabase,
  getTestModule,
  createTestQuestion,
  createTestUser,
} from '../utils';
import { AnswerService } from '../../modules/answer/domain/services/AnswerService';
import { QuestionModel } from '../../modules/question/domain/models/QuestionModel';
import { UserModel } from '../../modules/user/domain/models/UserModel';
import { UserService } from '../../modules/user/domain/services/UserService';
import { IHashService } from '../../modules/auth/domain/interfaces/IHashService';
import { QuestionService } from '../../modules/question/domain/services/QuestionService';
import { AnswerSaveDto } from '../../modules/answer/domain/dtos/AnswerSaveDto';
import { AnswerModel } from '../../modules/answer/domain/models/AnswerModel';
import { IEventEmitterService } from '../../modules/global/domain/interfaces/IEventEmitterService';
import { EventEnum } from '../../modules/global/domain/enums/EventEnum';
import { RoleEnum } from '../../modules/user/domain/enums/RoleEnum';
import { ForbiddenException } from '../../modules/global/domain/exceptions/ForbiddenException';
import { AnswerUpdateDto } from '../../modules/answer/domain/dtos/AnswerUpdateDto';
import { ConflictException } from '../../modules/global/domain/exceptions/ConflictException';
import { NotFoundException } from '../../modules/global/domain/exceptions/NotFoundException';
import { plainToInstance } from 'class-transformer';
import { AnswerSearchDto } from '../../modules/answer/domain/dtos/AnswerSearchDto';
import { omit as _omit } from 'lodash';

describe('AnswerService', () => {
  let answerService: AnswerService;
  let userService: UserService;
  let hashService: IHashService;
  let questionService: QuestionService;
  let dataSource: DataSource;
  let eventEmitterService: IEventEmitterService;

  let user: UserModel;
  let question: QuestionModel;
  let answer: AnswerModel;

  const createTestAnswer = () =>
    answerService.create(user.id, {
      text: 'My Answer',
      questionId: question.id,
    });

  beforeAll(async () => {
    const moduleRef = await getTestModule();

    answerService = moduleRef.get(AnswerService);
    questionService = moduleRef.get(QuestionService);
    dataSource = moduleRef.get(DataSource);
    userService = moduleRef.get(UserService);
    hashService = moduleRef.get(IHashService);
    eventEmitterService = moduleRef.get(IEventEmitterService);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await refreshDatabase(dataSource);
    user = await createTestUser(userService, hashService);
    question = await createTestQuestion(user.id, questionService);
    answer = await createTestAnswer();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create AnswerModel and call EventEmitterService.emit', async () => {
      const dto: AnswerSaveDto = {
        text: 'My Answer',
        questionId: question.id,
      };
      const answer = await answerService.create(user.id, dto);

      expect(answer).toMatchObject({
        ...dto,
        authorId: user.id,
        isSolution: false,
      });
      expect(eventEmitterService.emit).toHaveBeenCalledWith(
        EventEnum.CREATE_NOTIFICATION,
        {
          userId: answer.question.authorId,
          payload: {
            questionId: answer.id,
            answerId: answer.id,
            answerAuthorId: answer.authorId,
            message: `Пользователь "${answer.author.nickname}" дал ответ на ваш вопрос "${answer.question.title}"`,
          },
        },
      );
    });
    it('should throw NotFoundException if question is not exists', async () => {
      await expect(
        answerService.create(user.id, {
          text: 'My Answer',
          questionId: 0,
        }),
      ).rejects.toThrow(NotFoundException);
      expect(eventEmitterService.emit).not.toHaveBeenCalled();
    });
  });

  describe('getOneBy', () => {
    it('should find AnswerModel', async () => {
      await expect(
        answerService.getOneBy({
          id: answer.id,
          questionId: question.id,
          authorId: user.id,
        }),
      ).resolves.toEqual(answer);
    });
    it('should throw NotFoundException if answer is not exists', async () => {
      await expect(answerService.getOneBy({ id: 0 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('search', () => {
    it('should find AnswerModel', async () => {
      const [answers, total] = await answerService.search(
        plainToInstance(AnswerSearchDto, {
          id: answer.id,
          questionId: question.id,
          authorId: user.id,
          text: answer.text.slice(0, 2),
        }),
      );

      expect(answers).toHaveLength(1);
      expect(total).toBe(1);
      expect(answers[0]).toEqual(_omit(answer, ['question', 'rating']));
    });
    it('should not find AnswerModel', async () => {
      const [answers, total] = await answerService.search(
        plainToInstance(AnswerSearchDto, {
          text: 'tri932ur3jhoffo93',
        }),
      );

      expect(answers).toHaveLength(0);
      expect(total).toBe(0);
    });
  });

  describe('delete', () => {
    it('should delete AnswerModel', async () => {
      await answerService.delete(
        {
          roles: [RoleEnum.USER],
          userId: user.id,
          email: user.email,
        },
        answer.id,
      );

      await expect(answerService.getOneBy({ id: answer.id })).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw ForbiddenException if answer is not belongs to user', async () => {
      await expect(
        answerService.delete(
          {
            roles: [RoleEnum.USER],
            userId: user.id + 1,
            email: user.email,
          },
          answer.id,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update AnswerModel', async () => {
      const dto: AnswerUpdateDto = {
        text: 'New Text!',
      };
      const updatedAnswer = await answerService.update(user.id, answer.id, dto);

      expect(updatedAnswer.text).not.toBe(answer);
      expect(updatedAnswer.id).toBe(answer.id);
      expect(updatedAnswer.text).toBe(dto.text);
    });
    it('should throw ForbiddenException if answer is not belongs to user', async () => {
      await expect(
        answerService.update(user.id + 1, answer.id, {
          text: 'New Text!',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('resolveQuestion', () => {
    it('should resolve question by answer', async () => {
      await answerService.resolveQuestion(user.id, question.id, answer.id);
      const updatedAnswer = await answerService.getOneBy({ id: answer.id });
      expect(updatedAnswer.isSolution).toBeTruthy();
    });
    it('should throw ForbiddenException if question is not belongs to user', async () => {
      await expect(
        answerService.resolveQuestion(user.id + 1, question.id, answer.id),
      ).rejects.toThrow(ForbiddenException);
    });
    it('should throw NotFoundException if answer is not belongs to question', async () => {
      await expect(
        answerService.resolveQuestion(user.id, question.id, answer.id + 1),
      ).rejects.toThrow(NotFoundException);
    });
    it('should throw ConflictException if answer already is solution', async () => {
      await answerService.resolveQuestion(user.id, question.id, answer.id);
      await expect(
        answerService.resolveQuestion(user.id, question.id, answer.id),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteResolveQuestion', () => {
    it('should delete resolve question by answer', async () => {
      await answerService.resolveQuestion(user.id, question.id, answer.id);
      await answerService.deleteResolveQuestion(user.id, question.id);
      const updatedAnswer = await answerService.getOneBy({ id: answer.id });
      expect(updatedAnswer.isSolution).toBeFalsy();
    });
    it('should throw ForbiddenException if question is not belongs to user', async () => {
      await expect(
        answerService.deleteResolveQuestion(user.id + 10, question.id),
      ).rejects.toThrow(ForbiddenException);
    });
    it('should throw ConflictException if answer is not solution', async () => {
      await expect(
        answerService.deleteResolveQuestion(user.id, question.id),
      ).rejects.toThrow(ConflictException);
    });
  });
});
