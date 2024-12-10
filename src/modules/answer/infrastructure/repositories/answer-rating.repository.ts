import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AnswerRatingModel } from '../../domain/models/answer-rating.model';
import { CreateAnswerRatingDto } from '../../domain/dtos/create-answer-rating.dto';
import { SearchAnswerRatingDto } from '../../domain/dtos/search-answer-rating.dto';
import { DeleteAnswerRatingDto } from '../../domain/dtos/delete-answer-rating.dto';
import { IAnswerRatingRepository } from '../../domain/interfaces/i-answer-rating-repository';
import { AnswerRatingEntity } from '../entities/answer-rating.entity';

@Injectable()
export class AnswerRatingRepository implements IAnswerRatingRepository {
  constructor(
    @InjectRepository(AnswerRatingEntity)
    private readonly dbRepository: Repository<AnswerRatingModel>,
  ) {}

  create(dto: CreateAnswerRatingDto) {
    return this.dbRepository.save(dto);
  }

  getOneBy(dto: SearchAnswerRatingDto) {
    return this.dbRepository.findOneBy(dto);
  }

  async delete(dto: DeleteAnswerRatingDto) {
    await this.dbRepository.delete(dto);
  }
}
