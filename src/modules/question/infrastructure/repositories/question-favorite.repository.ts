import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QuestionFavoriteModel } from '../../domain/models/question-favorite.model';
import { CreateQuestionFavoriteDto } from '../../domain/dtos/create-question-favorite.dto';
import { SearchQuestionFavoriteDto } from '../../domain/dtos/search-question-favorite.dto';
import { DeleteQuestionFavoriteDto } from '../../domain/dtos/delete-question-favorite.dto';
import { QuestionFavoriteEntity } from '../entities/question-favorite.entity';

@Injectable()
export class QuestionFavoriteRepository {
  constructor(
    @InjectRepository(QuestionFavoriteEntity)
    private readonly dbRepository: Repository<QuestionFavoriteModel>,
  ) {}

  create(dto: CreateQuestionFavoriteDto) {
    return this.dbRepository.save(dto);
  }

  getOneBy(dto: SearchQuestionFavoriteDto) {
    return this.dbRepository.findOneBy(dto);
  }

  async delete(dto: DeleteQuestionFavoriteDto) {
    await this.dbRepository.delete(dto);
  }
}
