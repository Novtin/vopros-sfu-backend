import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SaveQuestionDto } from '../dtos/save-question.dto';
import { ExistQuestionDto } from '../dtos/exist-question.dto';
import { SearchQuestionDto } from '../dtos/search-question.dto';
import { QuestionModel } from '../models/question.model';
import { UpdateQuestionDto } from '../dtos/update-question.dto';
import { FileService } from '../../../file/domain/services/file.service';
import { TagService } from '../../../tag/domain/services/tag.service';
import { TagModel } from '../../../tag/domain/models/tag.model';
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
    private readonly fileService: FileService,
    private readonly tagService: TagService,
  ) {}

  async addView(dto: CreateQuestionViewDto) {
    await this.throwNotFoundExceptionIfNotExist({ id: dto.questionId });
    const questionView = await this.questionViewRepository.getOneBy(dto);
    if (!questionView) {
      await this.questionViewRepository.create(dto);
    }
  }

  async getOneById(id: number): Promise<QuestionModel> {
    await this.throwNotFoundExceptionIfNotExist({ id });
    return this.questionRepository.getOneBy({ id });
  }

  existBy(dto: ExistQuestionDto): Promise<boolean> {
    return this.questionRepository.existBy(dto);
  }

  async create(authorId: number, dto: SaveQuestionDto): Promise<QuestionModel> {
    const tags: TagModel[] = [];
    for (const tagName of dto.tagNames) {
      let tagEntity = await this.tagService.getOneBy({ name: tagName });
      if (!tagEntity) {
        tagEntity = await this.tagService.create({ name: tagName });
      }
      tags.push(tagEntity);
    }
    return this.questionRepository.create({
      ...dto,
      tags,
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
    return this.questionRepository.update(id, dto);
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
    if (!context.roles.includes(RoleEnum.ADMIN)) {
      await this.throwForbiddenExceptionIfNotBelong(context.userId, id);
    }
    let questionEntity: QuestionModel = await this.getOneById(id);
    const fileIdsForDelete: number[] = questionEntity.images?.map(
      (file) => file.id,
    );
    questionEntity = await this.update(id, context.userId, {
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
      throw new NotFoundException();
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
    return this.getOneById(dto.questionId);
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
    if (favorite) {
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
