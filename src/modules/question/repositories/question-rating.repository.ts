import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionRatingEntity } from '../entities/question-rating.entity';
import { CreateQuestionRatingDto } from '../dtos/create-question-rating.dto';
import { Injectable } from '@nestjs/common';
import { SearchQuestionRatingDto } from '../dtos/search-question-rating.dto';
import { DeleteQuestionRatingDto } from '../dtos/delete-question-rating.dto';

@Injectable()
export class QuestionRatingRepository {
  constructor(
    @InjectRepository(QuestionRatingEntity)
    private readonly dbRepository: Repository<QuestionRatingEntity>,
  ) {}

  create(dto: CreateQuestionRatingDto) {
    return this.dbRepository.save(dto);
  }

  getOneBy(dto: SearchQuestionRatingDto) {
    return this.dbRepository.findOneBy(dto);
  }

  delete(dto: DeleteQuestionRatingDto) {
    return this.dbRepository.delete(dto);
  }
}
