import {
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

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly fileService: FileService,
  ) {}

  async getOneBy(dto: SearchQuestionDto): Promise<QuestionEntity> {
    await this.throwNotFoundExceptionIfNotExist(dto);
    return this.questionRepository.getOneBy(dto);
  }

  existBy(dto: ExistQuestionDto): Promise<boolean> {
    return this.questionRepository.existBy(dto);
  }

  create(dto: SaveQuestionDto): Promise<QuestionEntity> {
    return this.questionRepository.create(dto);
  }

  async update(id: number, dto: UpdateQuestionDto): Promise<QuestionEntity> {
    return this.questionRepository.update(id, dto);
  }

  search(dto: SearchQuestionDto): Promise<QuestionEntity[]> {
    return this.questionRepository.search(dto);
  }

  async delete(id: number): Promise<void> {
    await this.questionRepository.delete(id);
  }

  async uploadImages(id: number, imageFiles: Array<Express.Multer.File>) {
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
}
