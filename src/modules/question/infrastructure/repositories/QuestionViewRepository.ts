import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionViewModel } from '../../domain/models/QuestionViewModel';
import { QuestionViewCreateDto } from '../../domain/dtos/QuestionViewCreateDto';
import { QuestionViewSearchDto } from '../../domain/dtos/QuestionViewSearchDto';
import { IQuestionViewRepository } from '../../domain/interfaces/IQuestionViewRepository';
import { QuestionViewEntity } from '../entities/QuestionViewEntity';

@Injectable()
export class QuestionViewRepository implements IQuestionViewRepository {
  constructor(
    @InjectRepository(QuestionViewEntity)
    private readonly dbRepository: Repository<QuestionViewModel>,
  ) {}

  create(dto: QuestionViewCreateDto) {
    return this.dbRepository.save({ ...dto });
  }

  getOneBy(dto: QuestionViewSearchDto) {
    return this.dbRepository.findOneBy({ ...dto });
  }
}
