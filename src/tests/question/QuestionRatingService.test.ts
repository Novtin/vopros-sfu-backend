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
  createTestQuestion,
  createTestUser,
  getTestModule,
  refreshDatabase,
} from '../utils';
import { UserService } from '../../modules/user/domain/services/UserService';
import { UserModel } from '../../modules/user/domain/models/UserModel';
import { IHashService } from '../../modules/auth/domain/interfaces/IHashService';
import { QuestionService } from '../../modules/question/domain/services/QuestionService';
import { QuestionModel } from '../../modules/question/domain/models/QuestionModel';
import { NotFoundException } from '../../modules/global/domain/exceptions/NotFoundException';
import { RatingValueEnum } from '../../modules/global/domain/enums/RatingValueEnum';
import { QuestionRatingCreateDto } from '../../modules/question/domain/dtos/QuestionRatingCreateDto';
import { ConflictException } from '../../modules/global/domain/exceptions/ConflictException';
import { QuestionRatingService } from '../../modules/question/domain/services/QuestionRatingService';

describe('QuestionRatingService', () => {
  let dataSource: DataSource;
  let userService: UserService;
  let questionService: QuestionService;
  let questionRatingService: QuestionRatingService;
  let hashService: IHashService;
  let user: UserModel;
  let question: QuestionModel;

  beforeAll(async () => {
    const moduleRef = await getTestModule();

    userService = moduleRef.get(UserService);
    hashService = moduleRef.get(IHashService);
    dataSource = moduleRef.get(DataSource);
    questionService = moduleRef.get(QuestionService);
    questionRatingService = moduleRef.get(QuestionRatingService);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await refreshDatabase(dataSource);
    user = await createTestUser(userService, hashService);
    question = await createTestQuestion(user.id, questionService);
    jest.clearAllMocks();
  });

  describe('rate', () => {
    it('should rate QuestionModel', async () => {
      const rateDto: QuestionRatingCreateDto = {
        questionId: question.id,
        userId: user.id,
        value: RatingValueEnum.LIKE,
      };
      const ratedQuestion = await questionRatingService.setRating(rateDto);

      expect(ratedQuestion.rating).toHaveLength(1);
      expect(ratedQuestion.rating[0]).toMatchObject(
        rateDto as Record<string, any>,
      );
    });

    it('should throw ConflictException if this rating is exists', async () => {
      const rateDto: QuestionRatingCreateDto = {
        questionId: question.id,
        userId: user.id,
        value: RatingValueEnum.LIKE,
      };
      await questionRatingService.setRating(rateDto);

      await expect(questionRatingService.setRating(rateDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if question is not exists', async () => {
      await expect(
        questionRatingService.setRating({
          questionId: 0,
          userId: user.id,
          value: RatingValueEnum.LIKE,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteRate', () => {
    it('should delete rating QuestionModel', async () => {
      const dto = {
        questionId: question.id,
        userId: user.id,
        value: RatingValueEnum.LIKE,
      };
      await questionRatingService.setRating(dto);
      await questionRatingService.deleteRating(dto);
      const updatedQuestion = await questionService.getOneById(question.id);

      expect(updatedQuestion.rating).toHaveLength(0);
    });

    it('should throw NotFoundException if question is not exists', async () => {
      await expect(
        questionRatingService.deleteRating({
          questionId: 0,
          userId: user.id,
          value: RatingValueEnum.LIKE,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if rating is not exists', async () => {
      await expect(
        questionRatingService.deleteRating({
          questionId: question.id,
          userId: user.id,
          value: RatingValueEnum.LIKE,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
