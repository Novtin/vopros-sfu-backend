import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionViewModel } from '../../domain/models/question-view.model';
import { CreateQuestionViewDto } from '../../domain/dtos/create-question-view.dto';
import { SearchQuestionViewDto } from '../../domain/dtos/search-question-view.dto';
import { IQuestionViewRepository } from '../../domain/interfaces/i-question-view-repository';
import { QuestionViewEntity } from '../entities/question-view.entity';

@Injectable()
export class QuestionViewRepository implements IQuestionViewRepository {
  constructor(
    @InjectRepository(QuestionViewEntity)
    private readonly dbRepository: Repository<QuestionViewModel>,
  ) {}

  create(dto: CreateQuestionViewDto) {
    return this.dbRepository.save({ ...dto });
  }

  getOneBy(dto: SearchQuestionViewDto) {
    return this.dbRepository.findOneBy({ ...dto });
  }
}
