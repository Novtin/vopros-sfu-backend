import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AnswerRatingEntity } from '../entities/answer-rating.entity';
import { CreateAnswerRatingDto } from '../dtos/create-answer-rating.dto';
import { SearchAnswerRatingDto } from '../dtos/search-answer-rating.dto';
import { DeleteAnswerRatingDto } from '../dtos/delete-answer-rating.dto';

@Injectable()
export class AnswerRatingRepository {
  constructor(
    @InjectRepository(AnswerRatingEntity)
    private readonly dbRepository: Repository<AnswerRatingEntity>,
  ) {}

  create(dto: CreateAnswerRatingDto) {
    return this.dbRepository.save(dto);
  }

  getOneBy(dto: SearchAnswerRatingDto) {
    return this.dbRepository.findOneBy(dto);
  }

  delete(dto: DeleteAnswerRatingDto) {
    return this.dbRepository.delete(dto);
  }
}
