import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AnswerEntity } from '../entities/answer.entity';
import { CreateAnswerDto } from '../dtos/create-answer.dto';
import { ExistAnswerDto } from '../dtos/exist-answer.dto';
import { SearchAnswerDto } from '../dtos/search-answer.dto';
import { UpdateAnswerDto } from '../dtos/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnswerRepository {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly dbRepository: Repository<AnswerEntity>,
  ) {}

  async create(dto: CreateAnswerDto) {
    const model = await this.dbRepository.save({ ...dto });
    return this.getOneBy({ id: model.id });
  }

  getOneBy(dto: SearchAnswerDto) {
    return this.dbRepository
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.author', 'author')
      .leftJoinAndSelect('answer.question', 'question')
      .where(dto)
      .limit(1)
      .getOne();
  }

  existBy(dto: ExistAnswerDto) {
    return this.dbRepository.existsBy({ ...dto });
  }

  async search(dto: SearchAnswerDto) {
    const query = this.dbRepository
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.author', 'author');
    if (dto?.text) {
      query.where('answer.text ILIKE :text', { text: `%${dto.text}%` });
    }

    if (dto?.id) {
      query.andWhere({ id: dto.id });
    }

    if (dto?.authorId) {
      query.andWhere({ authorId: dto.authorId });
    }

    if (dto?.questionId) {
      query.andWhere({ questionId: dto.questionId });
    }

    if (dto?.isSolution) {
      query.andWhere({ isSolution: dto.isSolution });
    }

    query.limit(dto.pageSize);
    query.offset(dto.pageSize * dto.page);

    return query.getMany();
  }

  async delete(id: number) {
    await this.dbRepository.softDelete({ id });
  }

  async update(id: number, dto: UpdateAnswerDto) {
    await this.dbRepository.update(id, dto);
    return this.getOneBy({ id });
  }

  setSolution(id: number) {
    return this.dbRepository.update(id, { isSolution: true });
  }

  deleteSolution(id: number) {
    return this.dbRepository.update(id, { isSolution: false });
  }
}
