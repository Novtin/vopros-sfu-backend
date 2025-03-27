import { Inject, Injectable } from '@nestjs/common';
import { SearchTagDto } from '../dtos/search-tag.dto';
import { TagModel } from '../models/tag.model';
import { SaveTagDto } from '../dtos/save-tag.dto';
import { ITagRepository } from '../interfaces/i-tag-repository';

@Injectable()
export class TagService {
  constructor(
    @Inject(ITagRepository)
    private readonly tagRepository: ITagRepository,
  ) {}

  async createOrGetByNames(tagNames: string[]): Promise<TagModel[]> {
    const tags: TagModel[] = [];
    for (const tagName of tagNames.map((tag) => tag.toLowerCase())) {
      let tagEntity = await this.getOneBy({ name: tagName });
      if (!tagEntity) {
        tagEntity = await this.create({ name: tagName });
      }
      tags.push(tagEntity);
    }

    return tags;
  }

  search(dto: SearchTagDto): Promise<[TagModel[], number]> {
    return this.tagRepository.search(dto);
  }

  getOneBy(dto: SearchTagDto) {
    return this.tagRepository.getOneBy(dto);
  }

  create(dto: SaveTagDto) {
    return this.tagRepository.create(dto);
  }
}
