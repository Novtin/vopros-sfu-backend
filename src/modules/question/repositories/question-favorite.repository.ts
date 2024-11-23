import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QuestionFavoriteEntity } from '../entities/question-favorite.entity';
import { CreateQuestionFavoriteDto } from '../dtos/create-question-favorite.dto';
import { SearchQuestionFavoriteDto } from '../dtos/search-question-favorite.dto';
import { DeleteQuestionFavoriteDto } from '../dtos/delete-question-favorite.dto';

@Injectable()
export class QuestionFavoriteRepository {
  constructor(
    @InjectRepository(QuestionFavoriteEntity)
    private readonly dbRepository: Repository<QuestionFavoriteEntity>,
  ) {}

  create(dto: CreateQuestionFavoriteDto) {
    return this.dbRepository.save(dto);
  }

  getOneBy(dto: SearchQuestionFavoriteDto) {
    return this.dbRepository.findOneBy(dto);
  }

  delete(dto: DeleteQuestionFavoriteDto) {
    return this.dbRepository.delete(dto);
  }
}
