import { Inject, Injectable } from '@nestjs/common';
import { QuestionSaveDto } from '../dtos/QuestionSaveDto';
import { QuestionExistDto } from '../dtos/QuestionExistDto';
import { QuestionSearchDto } from '../dtos/QuestionSearchDto';
import { QuestionModel } from '../models/QuestionModel';
import { QuestionUpdateDto } from '../dtos/QuestionUpdateDto';
import { FileService } from '../../../file/domain/services/FileService';
import { TagService } from '../../../tag/domain/services/TagService';
import { ContextDto } from '../../../auth/domain/dtos/ContextDto';
import { RoleEnum } from '../../../user/domain/enums/RoleEnum';
import { QuestionViewCreateDto } from '../dtos/QuestionViewCreateDto';
import { QuestionRatingCreateDto } from '../dtos/QuestionRatingCreateDto';
import { QuestionFavoriteCreateDto } from '../dtos/QuestionFavoriteCreateDto';
import { QuestionFavoriteDeleteDto } from '../dtos/QuestionFavoriteDeleteDto';
import { QuestionRatingDeleteDto } from '../dtos/QuestionRatingDeleteDto';
import { IQuestionRepository } from '../interfaces/IQuestionRepository';
import { IQuestionFavoriteRepository } from '../interfaces/IQuestionFavoriteRepository';
import { IQuestionViewRepository } from '../interfaces/IQuestionViewRepository';
import { IQuestionRatingRepository } from '../interfaces/IQuestionRatingRepository';
import { IEventEmitterService } from '../../../global/domain/interfaces/IEventEmitterService';
import { EventEnum } from '../../../global/domain/enums/EventEnum';
import { BadRequestException } from '../../../global/domain/exceptions/BadRequestException';
import { ForbiddenException } from '../../../global/domain/exceptions/ForbiddenException';
import { NotFoundException } from '../../../global/domain/exceptions/NotFoundException';
import { ConflictException } from '../../../global/domain/exceptions/ConflictException';
import { IFile } from '../../../file/domain/interfaces/IFile';

@Injectable()
export class QuestionService {
  constructor(
    @Inject(IQuestionRepository)
    private readonly questionRepository: IQuestionRepository,
    @Inject(IQuestionViewRepository)
    private readonly questionViewRepository: IQuestionViewRepository,
    @Inject(IQuestionRatingRepository)
    private readonly questionRateRepository: IQuestionRatingRepository,
    @Inject(IQuestionFavoriteRepository)
    private readonly questionFavoriteRepository: IQuestionFavoriteRepository,
    @Inject(IEventEmitterService)
    private readonly evenEmitterService: IEventEmitterService,
    private readonly fileService: FileService,
    private readonly tagService: TagService,
  ) {}

  async view(dto: QuestionViewCreateDto) {
    const questionView = await this.questionViewRepository.getOneBy(dto);
    if (!questionView) {
      await this.questionViewRepository.create(dto);
      this.evenEmitterService.emit(EventEnum.VIEW_NOTIFICATION, {
        userId: dto.userId,
        payload: { questionId: dto.questionId },
      });
    }
  }

  async getOneById(
    questionId: number,
    userId?: number,
  ): Promise<QuestionModel> {
    await this.throwNotFoundExceptionIfNotExist({ id: questionId });
    if (userId) {
      await this.view({
        userId,
        questionId,
      });
    }
    return await this.questionRepository.getOneBy({ id: questionId });
  }

  existBy(dto: QuestionExistDto): Promise<boolean> {
    return this.questionRepository.existBy(dto);
  }

  async create(authorId: number, dto: QuestionSaveDto): Promise<QuestionModel> {
    return this.questionRepository.create({
      ...dto,
      tags: await this.tagService.createOrGetByNames(dto.tagNames),
      authorId,
    });
  }

  async update(
    userId: number,
    id: number,
    dto: QuestionUpdateDto,
  ): Promise<QuestionModel> {
    await this.throwNotFoundExceptionIfNotExist({ id });
    await this.throwForbiddenExceptionIfNotBelong(userId, id);
    let partialQuestionModel: Partial<QuestionModel>;
    if (dto.tagNames) {
      const tags = await this.tagService.createOrGetByNames(dto.tagNames);
      delete dto.tagNames;
      partialQuestionModel = {
        ...dto,
        tags,
      };
    } else {
      partialQuestionModel = {
        ...dto,
      };
    }
    return this.questionRepository.update(id, partialQuestionModel);
  }

  async delete(context: ContextDto, id: number): Promise<void> {
    if (!context.roles.includes(RoleEnum.ADMIN)) {
      await this.throwForbiddenExceptionIfNotBelong(context.userId, id);
    }
    await this.questionRepository.delete(id);
  }

  async uploadImages(context: ContextDto, id: number, imageFiles: IFile[]) {
    if (!imageFiles) {
      throw new BadRequestException('Файлы не найдены');
    }
    await this.throwNotFoundExceptionIfNotExist({ id });
    if (!context.roles.includes(RoleEnum.ADMIN)) {
      await this.throwForbiddenExceptionIfNotBelong(context.userId, id);
    }
    let questionEntity = await this.questionRepository.getOneBy({ id });
    const fileIdsForDelete: number[] = questionEntity.images?.map(
      (file) => file.id,
    );
    questionEntity = await this.update(context.userId, id, {
      images: await Promise.all(
        imageFiles.map(async (file) => await this.fileService.create(file)),
      ),
    });
    if (fileIdsForDelete) {
      await Promise.all(
        fileIdsForDelete.map(
          async (fileId) => await this.fileService.delete(fileId),
        ),
      );
    }
    return questionEntity;
  }

  async throwForbiddenExceptionIfNotBelong(userId: number, questionId: number) {
    if (!(await this.existBy({ authorId: userId, id: questionId }))) {
      throw new ForbiddenException();
    }
  }

  async throwNotFoundExceptionIfNotExist(dto: QuestionExistDto) {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException('ddd');
    }
  }

  async rate(dto: QuestionRatingCreateDto) {
    await this.throwNotFoundExceptionIfNotExist({ id: dto.questionId });
    const rate = await this.questionRateRepository.getOneBy({
      questionId: dto.questionId,
      userId: dto.userId,
    });
    if (rate?.value === dto.value) {
      throw new ConflictException('Вопрос уже так оценён пользователем');
    }
    await this.questionRateRepository.create(dto);
    return this.questionRepository.getOneBy({ id: dto.questionId });
  }

  async deleteRate(dto: QuestionRatingDeleteDto) {
    await this.throwNotFoundExceptionIfNotExist({ id: dto.questionId });
    const rate = await this.questionRateRepository.getOneBy({
      questionId: dto.questionId,
      userId: dto.userId,
      value: dto.value,
    });
    if (!rate) {
      throw new NotFoundException('Оценка не найдена');
    }
    await this.questionRateRepository.delete(dto);
  }

  async setFavorite(dto: QuestionFavoriteCreateDto) {
    await this.throwNotFoundExceptionIfNotExist({ id: dto.questionId });
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
    await this.throwNotFoundExceptionIfNotExist({ id: dto.questionId });
    const favorite = await this.questionFavoriteRepository.getOneBy({
      questionId: dto.questionId,
      userId: dto.userId,
    });
    if (!favorite) {
      throw new NotFoundException('Вопрос не найден в избранном');
    }
    await this.questionFavoriteRepository.delete(dto);
  }

  search(dto: QuestionSearchDto) {
    return this.questionRepository.search(dto);
  }

  getCountQuestions() {
    return this.questionRepository.getCountQuestions();
  }
}
