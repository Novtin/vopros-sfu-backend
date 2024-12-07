import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QuestionFavoriteEntity } from '../../domain/entities/question-favorite.entity';
import { CreateQuestionFavoriteDto } from '../../domain/dtos/create-question-favorite.dto';
import { SearchQuestionFavoriteDto } from '../../domain/dtos/search-question-favorite.dto';
import { DeleteQuestionFavoriteDto } from '../../domain/dtos/delete-question-favorite.dto';

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

  async delete(dto: DeleteQuestionFavoriteDto) {
    await this.dbRepository.delete(dto);
  }
}
