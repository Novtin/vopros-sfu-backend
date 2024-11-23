import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuestionRepository } from '../repositories/question.repository';
import { SaveQuestionDto } from '../dtos/save-question.dto';
import { ExistQuestionDto } from '../dtos/exist-question.dto';
import { SearchQuestionDto } from '../dtos/search-question.dto';
import { QuestionEntity } from '../entities/question.entity';
import { UpdateQuestionDto } from '../dtos/update-question.dto';
import { FileService } from '../../file/services/file.service';
import { RelationQuestionDto } from '../../file/dtos/relation-question.dto';
import { TagService } from '../../tag/services/tag.service';
import { TagEntity } from '../../tag/entities/tag.entity';
import { ContextDto } from '../../auth/dtos/context.dto';
import { RoleEnum } from '../../user/enum/role.enum';
import { QuestionViewRepository } from '../repositories/question-view.repository';
import { CreateQuestionViewDto } from '../dtos/create-question-view.dto';
import { QuestionRatingRepository } from '../repositories/question-rating.repository';
import { CreateQuestionRatingDto } from '../dtos/create-question-rating.dto';
import { QuestionFavoriteRepository } from '../repositories/question-favorite.repository';
import { CreateQuestionFavoriteDto } from '../dtos/create-question-favorite.dto';
import { DeleteQuestionFavoriteDto } from '../dtos/delete-question-favorite.dto';
import { DeleteQuestionRatingDto } from '../dtos/delete-question-rating.dto';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionViewRepository: QuestionViewRepository,
    private readonly questionRateRepository: QuestionRatingRepository,
    private readonly questionFavoriteRepository: QuestionFavoriteRepository,
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

  async getOneBy(dto: SearchQuestionDto): Promise<QuestionEntity> {
    await this.throwNotFoundExceptionIfNotExist(dto);
    return this.questionRepository.getOneBy(dto);
  }

  existBy(dto: ExistQuestionDto): Promise<boolean> {
    return this.questionRepository.existBy(dto);
  }

  async create(
    authorId: number,
    dto: SaveQuestionDto,
  ): Promise<QuestionEntity> {
    const tags: TagEntity[] = [];
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
  ): Promise<QuestionEntity> {
    await this.throwNotFoundExceptionIfNotExist({ id });
    await this.throwForbiddenExceptionIfNotBelong(userId, id);
    return this.questionRepository.update(id, dto);
  }

  search(dto: SearchQuestionDto): Promise<QuestionEntity[]> {
    return this.questionRepository.search(dto);
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
    let questionEntity: QuestionEntity = await this.getOneBy({ id });
    const fileIdsForDelete: number[] = questionEntity.images?.map(
      (file) => file.id,
    );
    questionEntity = await this.updateRelations(id, {
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

  async updateRelations(id: number, dto: RelationQuestionDto) {
    await this.throwNotFoundExceptionIfNotExist({ id });
    return this.questionRepository.updateRelations(id, dto);
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
    return this.getOneBy({ id: dto.questionId });
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
}
