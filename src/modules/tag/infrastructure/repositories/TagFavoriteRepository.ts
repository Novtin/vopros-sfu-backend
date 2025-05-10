import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagFavoriteEntity } from '../entities/TagFavoriteEntity';
import { ITagFavoriteRepository } from '../../domain/interfaces/ITagFavoriteRepository';
import { TagFavoriteModel } from '../../domain/models/TagFavoriteModel';

@Injectable()
export class TagFavoriteRepository implements ITagFavoriteRepository {
  constructor(
    @InjectRepository(TagFavoriteEntity)
    private readonly dbRepository: Repository<TagFavoriteModel>,
  ) {}

  async search(dto: Partial<TagFavoriteModel>): Promise<TagFavoriteModel[]> {
    return this.dbRepository.findBy(dto);
  }

  async delete(dto: Partial<TagFavoriteModel>): Promise<void> {
    await this.dbRepository.delete(dto);
  }

  create(dto: Partial<TagFavoriteModel>): Promise<TagFavoriteModel> {
    return this.dbRepository.save(dto);
  }
}
