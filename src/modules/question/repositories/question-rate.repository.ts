import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionRateEntity } from '../entities/question-rate.entity';
import { CreateQuestionRateDto } from '../dtos/create-question-rate.dto';
import { Injectable } from '@nestjs/common';
import { SearchQuestionRateDto } from '../dtos/search-question-rate.dto';

@Injectable()
export class QuestionRateRepository {
  constructor(
    @InjectRepository(QuestionRateEntity)
    private readonly dbRepository: Repository<QuestionRateEntity>,
  ) {}

  create(dto: CreateQuestionRateDto) {
    return this.dbRepository.save(dto);
  }

  getOneBy(dto: SearchQuestionRateDto) {
    return this.dbRepository.findOneBy(dto);
  }
}
