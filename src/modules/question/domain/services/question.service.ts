import { Inject, Injectable } from '@nestjs/common';
import { SaveQuestionDto } from '../dtos/save-question.dto';
import { ExistQuestionDto } from '../dtos/exist-question.dto';
import { SearchQuestionDto } from '../dtos/search-question.dto';
import { QuestionModel } from '../models/question.model';
import { UpdateQuestionDto } from '../dtos/update-question.dto';
import { FileService } from '../../../file/domain/services/file.service';
import { TagService } from '../../../tag/domain/services/tag.service';
import { ContextDto } from '../../../auth/domain/dtos/context.dto';
import { RoleEnum } from '../../../user/domain/enum/role.enum';
import { CreateQuestionViewDto } from '../dtos/create-question-view.dto';
import { CreateQuestionRatingDto } from '../dtos/create-question-rating.dto';
import { CreateQuestionFavoriteDto } from '../dtos/create-question-favorite.dto';
import { DeleteQuestionFavoriteDto } from '../dtos/delete-question-favorite.dto';
import { DeleteQuestionRatingDto } from '../dtos/delete-question-rating.dto';
import { IQuestionRepository } from '../interfaces/i-question-repository';
import { IQuestionFavoriteRepository } from '../interfaces/i-question-favorite-repository';
import { IQuestionViewRepository } from '../interfaces/i-question-view-repository';
import { IQuestionRatingRepository } from '../interfaces/i-question-rating-repository';
import { IEventEmitterService } from '../../../global/domain/interfaces/i-event-emitter-service';
import { EventEnum } from '../../../global/domain/enums/event.enum';
import { BadRequestException } from '../../../global/domain/exceptions/bad-request.exception';
import { ForbiddenException } from '../../../global/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../global/domain/exceptions/not-found.exception';
import { ConflictException } from '../../../global/domain/exceptions/conflict.exception';

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

  async view(dto: CreateQuestionViewDto) {
    const questionView = await this.questionViewRepository.getOneBy(dto);
    if (!questionView) {
      await this.questionViewRepository.create(dto);
      this.evenEmitterService.emit(EventEnum.VIEW_NOTIFICATION, {
        userId: dto.userId,
        payload: { questionId: dto.questionId },
      });
    }
  }

  async getOneById(questionId: number, userId: number): Promise<QuestionModel> {
    await this.throwNotFoundExceptionIfNotExist({ id: questionId });
    await this.view({
      userId,
      questionId,
    });
    return await this.questionRepository.getOneBy({ id: questionId });
  }

  existBy(dto: ExistQuestionDto): Promise<boolean> {
    return this.questionRepository.existBy(dto);
  }

  async create(authorId: number, dto: SaveQuestionDto): Promise<QuestionModel> {
    return this.questionRepository.create({
      ...dto,
      tags: await this.tagService.createOrGetByNames(dto.tagNames),
      authorId,
    });
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateQuestionDto,
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

  async uploadImages(
    context: ContextDto,
    id: number,
    imageFiles: Array<Express.Multer.File>,
  ) {
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

  async throwNotFoundExceptionIfNotExist(dto: ExistQuestionDto) {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException('ddd');
    }
  }

  async rate(dto: CreateQuestionRatingDto) {
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

  async deleteRate(dto: DeleteQuestionRatingDto) {
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

  async setFavorite(dto: CreateQuestionFavoriteDto) {
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

  async deleteFavorite(dto: DeleteQuestionFavoriteDto) {
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

  search(dto: SearchQuestionDto) {
    return this.questionRepository.search(dto);
  }

  getCountQuestions() {
    return this.questionRepository.getCountQuestions();
  }
}
