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
import { ConflictException } from '../../modules/global/domain/exceptions/ConflictException';
import { QuestionFavoriteCreateDto } from '../../modules/question/domain/dtos/QuestionFavoriteCreateDto';
import { QuestionFavoriteService } from '../../modules/question/domain/services/QuestionFavoriteService';

describe('QuestionFavoriteService', () => {
  let dataSource: DataSource;
  let userService: UserService;
  let questionService: QuestionService;
  let questionFavoriteService: QuestionFavoriteService;
  let hashService: IHashService;
  let user: UserModel;
  let question: QuestionModel;

  beforeAll(async () => {
    const moduleRef = await getTestModule();

    userService = moduleRef.get(UserService);
    hashService = moduleRef.get(IHashService);
    dataSource = moduleRef.get(DataSource);
    questionService = moduleRef.get(QuestionService);
    questionFavoriteService = moduleRef.get(QuestionFavoriteService);
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

  describe('setFavorite', () => {
    it('should set favorite QuestionModel', async () => {
      const favoriteDto: QuestionFavoriteCreateDto = {
        questionId: question.id,
        userId: user.id,
      };
      await questionFavoriteService.setFavorite(favoriteDto);

      const updatedUser = await userService.getOneBy({ id: user.id });
      expect(updatedUser.questionsFavorite).toHaveLength(1);
      expect(updatedUser.questionsFavorite[0]).toMatchObject(
        favoriteDto as Record<string, any>,
      );
    });

    it('should throw ConflictException if question is already in favorite', async () => {
      const favoriteDto: QuestionFavoriteCreateDto = {
        questionId: question.id,
        userId: user.id,
      };
      await questionFavoriteService.setFavorite(favoriteDto);

      await expect(
        questionFavoriteService.setFavorite(favoriteDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if question is not exists', async () => {
      await expect(
        questionFavoriteService.setFavorite({
          questionId: 0,
          userId: user.id,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteFavorite', () => {
    it('should delete favorite QuestionModel', async () => {
      const dto = {
        questionId: question.id,
        userId: user.id,
      };
      await questionFavoriteService.setFavorite(dto);
      await questionFavoriteService.deleteFavorite(dto);
      const updatedUser = await userService.getOneBy({ id: user.id });

      expect(updatedUser.questionsFavorite).toHaveLength(0);
    });

    it('should throw NotFoundException if question is not exists', async () => {
      await expect(
        questionFavoriteService.deleteFavorite({
          questionId: 0,
          userId: user.id,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if favorite is not exists', async () => {
      await expect(
        questionFavoriteService.deleteFavorite({
          questionId: question.id,
          userId: user.id,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
