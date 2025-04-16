import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionRatingModel } from '../../domain/models/QuestionRatingModel';
import { QuestionRatingCreateDto } from '../../domain/dtos/QuestionRatingCreateDto';
import { Injectable } from '@nestjs/common';
import { QuestionRatingSearchDto } from '../../domain/dtos/QuestionRatingSearchDto';
import { QuestionRatingDeleteDto } from '../../domain/dtos/QuestionRatingDeleteDto';
import { IQuestionRatingRepository } from '../../domain/interfaces/IQuestionRatingRepository';
import { QuestionRatingEntity } from '../entities/QuestionRatingEntity';

@Injectable()
export class QuestionRatingRepository implements IQuestionRatingRepository {
  constructor(
    @InjectRepository(QuestionRatingEntity)
    private readonly dbRepository: Repository<QuestionRatingModel>,
  ) {}

  create(dto: QuestionRatingCreateDto) {
    return this.dbRepository.save(dto);
  }

  getOneBy(dto: QuestionRatingSearchDto) {
    return this.dbRepository.findOneBy(dto);
  }

  async delete(dto: QuestionRatingDeleteDto) {
    await this.dbRepository.delete(dto);
  }
}
