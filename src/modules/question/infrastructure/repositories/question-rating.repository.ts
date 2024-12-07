import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionRatingEntity } from '../../domain/entities/question-rating.entity';
import { CreateQuestionRatingDto } from '../../domain/dtos/create-question-rating.dto';
import { Injectable } from '@nestjs/common';
import { SearchQuestionRatingDto } from '../../domain/dtos/search-question-rating.dto';
import { DeleteQuestionRatingDto } from '../../domain/dtos/delete-question-rating.dto';
import { IQuestionRatingRepository } from '../../domain/interfaces/i-question-rating-repository';

@Injectable()
export class QuestionRatingRepository implements IQuestionRatingRepository {
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

  async delete(dto: DeleteQuestionRatingDto) {
    await this.dbRepository.delete(dto);
  }
}
