import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AnswerRatingEntity } from '../entities/AnswerRatingEntity';
import { IAnswerRatingRepository } from '../../domain/interfaces/IAnswerRatingRepository';
import { AnswerRatingModel } from '../../domain/models/AnswerRatingModel';
import { AnswerRatingSearchDto } from '../../domain/dtos/AnswerRatingSearchDto';
import { AnswerRatingCreateDto } from '../../domain/dtos/AnswerRatingCreateDto';
import { AnswerRatingDeleteDto } from '../../domain/dtos/AnswerRatingDeleteDto';

@Injectable()
export class AnswerRatingRepository implements IAnswerRatingRepository {
  constructor(
    @InjectRepository(AnswerRatingEntity)
    private readonly dbRepository: Repository<AnswerRatingModel>,
  ) {}

  create(dto: AnswerRatingCreateDto) {
    return this.dbRepository.save(dto);
  }

  getOneBy(dto: AnswerRatingSearchDto) {
    return this.dbRepository.findOneBy(dto);
  }

  async delete(dto: AnswerRatingDeleteDto) {
    await this.dbRepository.delete(dto);
  }
}
