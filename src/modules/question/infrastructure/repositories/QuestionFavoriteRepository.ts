import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QuestionFavoriteModel } from '../../domain/models/QuestionFavoriteModel';
import { QuestionFavoriteCreateDto } from '../../domain/dtos/QuestionFavoriteCreateDto';
import { QuestionFavoriteSearchDto } from '../../domain/dtos/QuestionFavoriteSearchDto';
import { QuestionFavoriteDeleteDto } from '../../domain/dtos/QuestionFavoriteDeleteDto';
import { QuestionFavoriteEntity } from '../entities/QuestionFavoriteEntity';

@Injectable()
export class QuestionFavoriteRepository {
  constructor(
    @InjectRepository(QuestionFavoriteEntity)
    private readonly dbRepository: Repository<QuestionFavoriteModel>,
  ) {}

  create(dto: QuestionFavoriteCreateDto) {
    return this.dbRepository.save(dto);
  }

  getOneBy(dto: QuestionFavoriteSearchDto) {
    return this.dbRepository.findOneBy(dto);
  }

  async delete(dto: QuestionFavoriteDeleteDto) {
    await this.dbRepository.delete(dto);
  }
}
