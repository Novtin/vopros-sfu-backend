import { Inject, Injectable } from '@nestjs/common';
import { TagSearchDto } from '../dtos/TagSearchDto';
import { TagModel } from '../models/TagModel';
import { TagSaveDto } from '../dtos/TagSaveDto';
import { ITagRepository } from '../interfaces/ITagRepository';

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

  search(dto: TagSearchDto): Promise<[TagModel[], number]> {
    return this.tagRepository.search(dto);
  }

  getOneBy(dto: TagSearchDto) {
    return this.tagRepository.getOneBy(dto);
  }

  private create(dto: TagSaveDto) {
    return this.tagRepository.create(dto);
  }
}
