import { Inject, Injectable } from '@nestjs/common';
import { TagService } from './TagService';
import { TagSetFavoritesDto } from '../dtos/TagSetFavoritesDto';
import { ITagFavoriteRepository } from '../interfaces/ITagFavoriteRepository';
import { NotFoundException } from '../../../global/domain/exceptions/NotFoundException';

@Injectable()
export class TagFavoriteService {
  constructor(
    private readonly tagService: TagService,
    @Inject(ITagFavoriteRepository)
    private readonly tagFavoriteRepository: ITagFavoriteRepository,
  ) {}

  async setFavorites(userId: number, dto: TagSetFavoritesDto) {
    await Promise.all(
      dto.tagsIds.map(async (tagId) => {
        if (!(await this.tagService.getOneBy({ id: tagId }))) {
          throw new NotFoundException();
        }
      }),
    );

    const existTagFavorites = await this.tagFavoriteRepository.search({
      userId,
    });

    const favoriteUserTagIds = existTagFavorites.map(
      (tagFavorite) => tagFavorite.tagId,
    );

    const deletingTagIds = favoriteUserTagIds.filter(
      (id) => !dto.tagsIds.includes(id),
    );

    await Promise.all(
      deletingTagIds.map((tagId) =>
        this.tagFavoriteRepository.delete({
          tagId,
          userId,
        }),
      ),
    );

    const addingTagIds = dto.tagsIds.filter(
      (id) => !favoriteUserTagIds.includes(id),
    );

    await Promise.all(
      addingTagIds.map((tagId) =>
        this.tagFavoriteRepository.create({
          tagId,
          userId,
        }),
      ),
    );
  }
}
