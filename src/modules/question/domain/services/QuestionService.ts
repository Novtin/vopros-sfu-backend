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
import { IQuestionRepository } from '../interfaces/IQuestionRepository';
import { IQuestionViewRepository } from '../interfaces/IQuestionViewRepository';
import { IEventEmitterService } from '../../../global/domain/interfaces/IEventEmitterService';
import { EventEnum } from '../../../global/domain/enums/EventEnum';
import { BadRequestException } from '../../../global/domain/exceptions/BadRequestException';
import { ForbiddenException } from '../../../global/domain/exceptions/ForbiddenException';
import { NotFoundException } from '../../../global/domain/exceptions/NotFoundException';
import { IFile } from '../../../file/domain/interfaces/IFile';

@Injectable()
export class QuestionService {
  constructor(
    @Inject(IQuestionRepository)
    private readonly questionRepository: IQuestionRepository,
    @Inject(IQuestionViewRepository)
    private readonly questionViewRepository: IQuestionViewRepository,
    @Inject(IEventEmitterService)
    private readonly evenEmitterService: IEventEmitterService,
    private readonly fileService: FileService,
    private readonly tagService: TagService,
  ) {}

  private async view(dto: QuestionViewCreateDto) {
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
      throw new NotFoundException();
    }
  }

  search(dto: QuestionSearchDto) {
    return this.questionRepository.search(dto);
  }

  getCount() {
    return this.questionRepository.getCount();
  }
}
