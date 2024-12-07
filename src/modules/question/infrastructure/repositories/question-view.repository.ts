import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionViewEntity } from '../../domain/entities/question-view.entity';
import { CreateQuestionViewDto } from '../../domain/dtos/create-question-view.dto';
import { SearchQuestionViewDto } from '../../domain/dtos/search-question-view.dto';
import { IQuestionViewRepository } from '../../domain/interfaces/i-question-view-repository';

@Injectable()
export class QuestionViewRepository implements IQuestionViewRepository {
  constructor(
    @InjectRepository(QuestionViewEntity)
    private readonly dbRepository: Repository<QuestionViewEntity>,
  ) {}

  create(dto: CreateQuestionViewDto) {
    return this.dbRepository.save({ ...dto });
  }

  getOneBy(dto: SearchQuestionViewDto) {
    return this.dbRepository.findOneBy({ ...dto });
  }
}
