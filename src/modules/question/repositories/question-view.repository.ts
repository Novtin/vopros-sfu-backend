import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionViewEntity } from '../entities/question-view.entity';
import { CreateQuestionViewDto } from '../dtos/create-question-view.dto';
import { SearchQuestionViewDto } from '../dtos/search-question-view.dto';

@Injectable()
export class QuestionViewRepository {
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
