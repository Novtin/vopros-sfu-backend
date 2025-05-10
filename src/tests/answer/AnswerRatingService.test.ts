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
import { AnswerModel } from '../../modules/answer/domain/models/AnswerModel';
import { ConflictException } from '../../modules/global/domain/exceptions/ConflictException';
import { RatingValueEnum } from '../../modules/global/domain/enums/RatingValueEnum';
import { AnswerRatingCreateDto } from '../../modules/answer/domain/dtos/AnswerRatingCreateDto';
import { NotFoundException } from '../../modules/global/domain/exceptions/NotFoundException';
import { AnswerRatingService } from '../../modules/answer/domain/services/AnswerRatingService';

describe('AnswerRatingService', () => {
  let answerService: AnswerService;
  let answerRatingService: AnswerRatingService;
  let userService: UserService;
  let hashService: IHashService;
  let questionService: QuestionService;
  let dataSource: DataSource;

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
    answerRatingService = moduleRef.get(AnswerRatingService);
    questionService = moduleRef.get(QuestionService);
    dataSource = moduleRef.get(DataSource);
    userService = moduleRef.get(UserService);
    hashService = moduleRef.get(IHashService);
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

  describe('rate', () => {
    it('should rate AnswerModel', async () => {
      const rateDto: AnswerRatingCreateDto = {
        answerId: answer.id,
        userId: user.id,
        value: RatingValueEnum.LIKE,
      };
      const ratedAnswer = await answerRatingService.rate(rateDto);

      expect(ratedAnswer.rating).toHaveLength(1);
      expect(ratedAnswer.rating[0]).toMatchObject(
        rateDto as Record<string, any>,
      );
    });

    it('should throw ConflictException if this rating is exists', async () => {
      const rateDto: AnswerRatingCreateDto = {
        answerId: answer.id,
        userId: user.id,
        value: RatingValueEnum.LIKE,
      };
      await answerRatingService.rate(rateDto);

      await expect(answerRatingService.rate(rateDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if answer is not exists', async () => {
      await expect(
        answerRatingService.rate({
          answerId: 0,
          userId: user.id,
          value: RatingValueEnum.LIKE,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteRate', () => {
    it('should delete rating AnswerModel', async () => {
      const dto: AnswerRatingCreateDto = {
        answerId: answer.id,
        userId: user.id,
        value: RatingValueEnum.LIKE,
      };
      await answerRatingService.rate(dto);
      await answerRatingService.deleteRate(dto);
      const updatedAnswer = await answerService.getOneBy({ id: answer.id });

      expect(updatedAnswer.rating).toHaveLength(0);
    });

    it('should throw NotFoundException if answer is not exists', async () => {
      await expect(
        answerRatingService.deleteRate({
          answerId: 0,
          userId: user.id,
          value: RatingValueEnum.LIKE,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if rating is not exists', async () => {
      await expect(
        answerRatingService.deleteRate({
          answerId: question.id,
          userId: user.id,
          value: RatingValueEnum.LIKE,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
