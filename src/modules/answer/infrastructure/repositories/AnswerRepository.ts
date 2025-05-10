import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AnswerExistDto } from '../../domain/dtos/AnswerExistDto';
import { AnswerSearchDto } from '../../domain/dtos/AnswerSearchDto';
import { AnswerUpdateDto } from '../../domain/dtos/AnswerUpdateDto';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerEntity } from '../entities/AnswerEntity';
import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';
import { AnswerModel } from '../../domain/models/AnswerModel';
import { AnswerCreateDto } from '../../domain/dtos/AnswerCreateDto';

@Injectable()
export class AnswerRepository implements IAnswerRepository {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly dbRepository: Repository<AnswerModel>,
  ) {}

  async create(dto: AnswerCreateDto) {
    const model = await this.dbRepository.save({ ...dto });
    return this.getOneBy({ id: model.id });
  }

  getOneBy(dto: AnswerSearchDto) {
    return this.dbRepository
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.author', 'author')
      .leftJoinAndSelect('author.avatar', 'authorAvatar')
      .leftJoinAndSelect('answer.question', 'question')
      .leftJoinAndSelect('answer.rating', 'rating')
      .where(dto)
      .take(1)
      .getOne();
  }

  existBy(dto: AnswerExistDto) {
    return this.dbRepository.existsBy({ ...dto });
  }

  async search(dto: AnswerSearchDto) {
    const query = this.dbRepository
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.author', 'author')
      .leftJoinAndSelect('author.avatar', 'authorAvatar');
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

    query.take(dto.pageSize);
    query.skip(dto.pageSize * dto.page);

    return query.getManyAndCount();
  }

  async delete(id: number) {
    await this.dbRepository.softDelete({ id });
  }

  async update(id: number, dto: AnswerUpdateDto) {
    await this.dbRepository.update(id, dto);
    return this.getOneBy({ id });
  }

  async setSolution(id: number) {
    await this.dbRepository.update(id, { isSolution: true });
  }

  async deleteSolution(id: number) {
    await this.dbRepository.update(id, { isSolution: false });
  }
}
