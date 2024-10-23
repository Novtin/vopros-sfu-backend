import { Injectable } from '@nestjs/common';
import { TagRepository } from '../repositories/tag.repository';
import { SearchTagDto } from '../dtos/search-tag.dto';
import { TagEntity } from '../entities/tag.entity';
import { SaveTagDto } from '../dtos/save-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  search(dto: SearchTagDto): Promise<TagEntity[]> {
    return this.tagRepository.search(dto);
  }

  getOneBy(dto: SearchTagDto) {
    return this.tagRepository.getOneBy(dto);
  }

  create(dto: SaveTagDto) {
    return this.tagRepository.create(dto);
  }
}
