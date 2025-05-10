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
import { IEventEmitterService } from '../../modules/global/domain/interfaces/IEventEmitterService';
import { omit as _omit, orderBy as _orderBy } from 'lodash';
import { QuestionService } from '../../modules/question/domain/services/QuestionService';
import { QuestionSaveDto } from '../../modules/question/domain/dtos/QuestionSaveDto';
import { IQuestionViewRepository } from '../../modules/question/domain/interfaces/IQuestionViewRepository';
import { QuestionModel } from '../../modules/question/domain/models/QuestionModel';
import { QuestionUpdateDto } from '../../modules/question/domain/dtos/QuestionUpdateDto';
import { ForbiddenException } from '../../modules/global/domain/exceptions/ForbiddenException';
import { NotFoundException } from '../../modules/global/domain/exceptions/NotFoundException';
import { QuestionSearchDto } from '../../modules/question/domain/dtos/QuestionSearchDto';
import { RoleEnum } from '../../modules/user/domain/enums/RoleEnum';
import { ContextDto } from '../../modules/auth/domain/dtos/ContextDto';
import { IFile } from '../../modules/file/domain/interfaces/IFile';
import { BadRequestException } from '../../modules/global/domain/exceptions/BadRequestException';
import { FileService } from '../../modules/file/domain/services/FileService';
import { QuestionSortEnum } from '../../modules/question/domain/enums/QuestionSortEnum';

describe('QuestionService', () => {
  let eventEmitterService: IEventEmitterService;
  let dataSource: DataSource;
  let userService: UserService;
  let fileService: FileService;
  let questionService: QuestionService;
  let questionViewRepository: IQuestionViewRepository;
  let hashService: IHashService;
  let user: UserModel;
  let question: QuestionModel;

  beforeAll(async () => {
    const moduleRef = await getTestModule();

    userService = moduleRef.get(UserService);
    hashService = moduleRef.get(IHashService);
    dataSource = moduleRef.get(DataSource);
    eventEmitterService = moduleRef.get(IEventEmitterService);
    questionViewRepository = moduleRef.get(IQuestionViewRepository);
    questionService = moduleRef.get(QuestionService);
    fileService = moduleRef.get(FileService);
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

  describe('create', () => {
    it('should create QuestionModel', async () => {
      const dto: QuestionSaveDto = {
        title: 'test title',
        description: 'test description',
        tagNames: ['tag', 'other_tag'],
      };

      const question = await questionService.create(user.id, dto);
      expect(question).toMatchObject({
        title: dto.title,
        description: dto.description,
        authorId: user.id,
      });
      expect(_orderBy(question.tags.map((tag) => tag.name))).toEqual(
        _orderBy(dto.tagNames),
      );
    });
  });

  describe('getOneById', () => {
    it('should find QuestionModel and not call view', async () => {
      jest.spyOn(questionViewRepository, 'create');
      const foundQuestion = await questionService.getOneById(question.id);
      expect(foundQuestion).toEqual(question);
      expect(questionViewRepository.create).not.toHaveBeenCalled();
      expect(eventEmitterService.emit).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if QuestionModel is not found', async () => {
      await expect(questionService.getOneById(0)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create view for question if view is not exists', async () => {
      await questionService.getOneById(question.id, user.id);

      await expect(
        questionViewRepository.getOneBy({
          userId: user.id,
          questionId: question.id,
        }),
      ).resolves.toMatchObject({
        userId: user.id,
        questionId: question.id,
      });
    });

    it('should not create view for question if view is exists', async () => {
      jest.spyOn(questionViewRepository, 'create');

      await questionService.getOneById(question.id, user.id);
      await questionService.getOneById(question.id, user.id);

      expect(questionViewRepository.create).toHaveBeenCalledTimes(1);
      expect(eventEmitterService.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update QuestionModel', async () => {
      const dto: QuestionUpdateDto = {
        title: 'new title',
      };

      const previousTitle = question.title;
      const updatedQuestion = await questionService.update(
        user.id,
        question.id,
        dto,
      );

      expect(updatedQuestion.title).not.toBe(previousTitle);
      expect(updatedQuestion.title).toBe(dto.title);
      expect(_omit(updatedQuestion, ['updatedAt', 'title'])).toEqual(
        _omit(question, ['updatedAt', 'title']),
      );
    });

    it('should throw NotFoundException if QuestionModel is not found', async () => {
      await expect(questionService.update(user.id, 0, {})).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw ForbiddenException if QuestionModel is not belongs to user', async () => {
      await expect(questionService.update(0, question.id, {})).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getCount', () => {
    it('should return count of QuestionModel', async () => {
      await expect(questionService.getCount()).resolves.toEqual({ count: 1 });
    });
  });

  describe('search', () => {
    it('should find QuestionModels', async () => {
      const searchDto = new QuestionSearchDto();
      searchDto.id = question.id;
      searchDto.sort = QuestionSortEnum.CREATED_AT;
      const [questions, total] = await questionService.search(searchDto);
      expect(questions).toHaveLength(1);
      expect(questions[0].id).toBe(question.id);
      expect(total).toBe(1);
    });

    it('should not find QuestionModels', async () => {
      const searchDto = new QuestionSearchDto();
      searchDto.isResolved = true;
      searchDto.sort = QuestionSortEnum.CREATED_AT;
      const [questions, total] = await questionService.search(searchDto);
      expect(questions).toHaveLength(0);
      expect(total).toBe(0);
    });
  });

  describe('uploadImages', () => {
    it('should upload images to QuestionModel', async () => {
      const files = Array.from(
        { length: 2 },
        (value, index): IFile => ({
          filename: `${index}.png`,
          size: 100,
          mimetype: 'image/png',
        }),
      );
      const updatedQuestion = await questionService.uploadImages(
        {
          roles: [RoleEnum.USER],
          userId: user.id,
        } as ContextDto,
        question.id,
        files,
      );
      expect(
        _orderBy(
          updatedQuestion.images.map(
            (file): IFile => ({
              filename: file.name,
              size: file.size,
              mimetype: file.mimetype,
            }),
          ),
        ),
      ).toEqual(_orderBy(files));
    });

    it('should throw BadRequestException if images is not exists', async () => {
      await expect(
        questionService.uploadImages({} as ContextDto, question.id, undefined),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if question is not found', async () => {
      const files = Array.from(
        { length: 2 },
        (value, index): IFile => ({
          filename: `${index}.png`,
          size: 100,
          mimetype: 'image/png',
        }),
      );
      await expect(
        questionService.uploadImages({} as ContextDto, 0, files),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if question is not belongs to user', async () => {
      const files = Array.from(
        { length: 2 },
        (value, index): IFile => ({
          filename: `${index}.png`,
          size: 100,
          mimetype: 'image/png',
        }),
      );
      await expect(
        questionService.uploadImages(
          { userId: 0, roles: [RoleEnum.USER] } as ContextDto,
          question.id,
          files,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should upload images to QuestionModel and remove previous images', async () => {
      const files = Array.from(
        { length: 2 },
        (value, index): IFile => ({
          filename: `${index}.png`,
          size: 100,
          mimetype: 'image/png',
        }),
      );
      await questionService.uploadImages(
        {
          roles: [RoleEnum.USER],
          userId: user.id,
        } as ContextDto,
        question.id,
        files,
      );
      await questionService.uploadImages(
        {
          roles: [RoleEnum.USER],
          userId: user.id,
        } as ContextDto,
        question.id,
        [
          {
            filename: `test.png`,
            size: 100,
            mimetype: 'image/png',
          },
        ],
      );

      const resultSearchingFiles = await Promise.allSettled(
        files.map((file) => fileService.getOneBy({ name: file.filename })),
      );
      expect(
        resultSearchingFiles.every(
          (promiseResult) =>
            promiseResult.status === 'rejected' &&
            promiseResult.reason instanceof NotFoundException,
        ),
      ).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should delete QuestionModel', async () => {
      await questionService.delete(
        {
          roles: [RoleEnum.USER],
          userId: user.id,
        } as ContextDto,
        question.id,
      );
      await expect(questionService.getOneById(question.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if QuestionModel is not exists', async () => {
      await expect(
        questionService.delete(
          {
            roles: [RoleEnum.USER],
            userId: 0,
          } as ContextDto,
          question.id,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
