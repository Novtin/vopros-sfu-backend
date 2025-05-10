import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { DataSource } from 'typeorm';
import { refreshDatabase, getTestModule, createTestUser } from '../utils';
import { TagService } from '../../modules/tag/domain/services/TagService';
import { orderBy as _orderBy } from 'lodash';
import { TagFavoriteService } from '../../modules/tag/domain/services/TagFavoriteService';
import { TagModel } from '../../modules/tag/domain/models/TagModel';
import { UserService } from '../../modules/user/domain/services/UserService';
import { IHashService } from '../../modules/auth/domain/interfaces/IHashService';
import { UserModel } from '../../modules/user/domain/models/UserModel';
import { NotFoundException } from '../../modules/global/domain/exceptions/NotFoundException';

describe('TagFavoriteService', () => {
  let tagService: TagService;
  let tagFavoriteService: TagFavoriteService;
  let dataSource: DataSource;
  let userService: UserService;
  let hashService: IHashService;
  let tags: TagModel[];
  let user: UserModel;

  beforeAll(async () => {
    const moduleRef = await getTestModule();

    tagService = moduleRef.get(TagService);
    tagFavoriteService = moduleRef.get(TagFavoriteService);
    dataSource = moduleRef.get(DataSource);
    userService = moduleRef.get(UserService);
    hashService = moduleRef.get(IHashService);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await refreshDatabase(dataSource);
    tags = await tagService.createOrGetByNames(['JavaScript', 'python']);
    user = await createTestUser(userService, hashService);
  });

  describe('setFavorites', () => {
    it('should set favorite tags to user', async () => {
      const tagsIds = tags.map((tag) => tag.id);
      await tagFavoriteService.setFavorites(user.id, { tagsIds });

      const updatedUser = await userService.getOneBy({ id: user.id });

      expect(
        _orderBy(
          updatedUser.tagsFavorite.map((tagFavorite) => tagFavorite.tagId),
        ),
      ).toEqual(_orderBy(tagsIds));
    });
    it('should throw NotFoundException if tags is not exists', async () => {
      await expect(
        tagFavoriteService.setFavorites(user.id, { tagsIds: [-1, 0] }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should set favorite tags to user and remove previous favorite tags', async () => {
      const tagsIds = tags.map((tag) => tag.id);
      await tagFavoriteService.setFavorites(user.id, { tagsIds });
      const newTagsIds = [tags[0].id].concat(
        (await tagService.createOrGetByNames(['newTag'])).map(
          (tagModel) => tagModel.id,
        ),
      );
      await tagFavoriteService.setFavorites(user.id, { tagsIds: newTagsIds });

      const updatedUser = await userService.getOneBy({ id: user.id });

      expect(
        _orderBy(
          updatedUser.tagsFavorite.map((tagFavorite) => tagFavorite.tagId),
        ),
      ).toEqual(_orderBy(newTagsIds));

      expect(
        _orderBy(
          updatedUser.tagsFavorite.map((tagFavorite) => tagFavorite.tagId),
        ),
      ).not.toEqual(_orderBy(tagsIds));
    });
  });
});
