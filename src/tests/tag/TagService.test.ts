import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { DataSource } from 'typeorm';
import { refreshDatabase, getTestModule } from '../utils';
import { TagService } from '../../modules/tag/domain/services/TagService';
import { orderBy as _orderBy } from 'lodash';
import { TagSearchDto } from '../../modules/tag/domain/dtos/TagSearchDto';

describe('TagService', () => {
  let tagService: TagService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await getTestModule();

    tagService = moduleRef.get(TagService);
    dataSource = moduleRef.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await refreshDatabase(dataSource);
  });

  describe('createOrGetByNames', () => {
    it('should create TagModels', async () => {
      const tagNames = ['JavaScript', 'python'];
      const tags = await tagService.createOrGetByNames(tagNames);
      expect(tags).toHaveLength(2);
      expect(_orderBy(tags.map((tag) => tag.name))).toEqual(
        _orderBy(tagNames.map((tagName) => tagName.toLowerCase())),
      );
    });
    it('should return TagModel if it is exists', async () => {
      const tagNames = ['JavaScript', 'python'];
      const tags = await tagService.createOrGetByNames(tagNames);

      expect(
        _orderBy(await tagService.createOrGetByNames(tagNames), 'id'),
      ).toEqual(_orderBy(tags, 'id'));
    });
  });

  describe('getOneBy', () => {
    it('should find TagModel', async () => {
      const tags = await tagService.createOrGetByNames(['tag1']);
      await expect(tagService.getOneBy({ id: tags[0].id })).resolves.toEqual(
        tags[0],
      );
    });
  });

  describe('search', () => {
    it('should find TagModels', async () => {
      const tagNames = ['JavaScript', 'python'];
      const createdTags = await tagService.createOrGetByNames(tagNames);
      const searchDto = new TagSearchDto();
      searchDto.name = tagNames[0].slice(0, 4);
      const [searchTags, total] = await tagService.search(searchDto);
      expect(searchTags).toHaveLength(1);
      expect(searchTags).toEqual(
        createdTags
          .filter((tag) => tag.name === tagNames[0].toLowerCase())
          .map((tag) => ({
            id: tag.id,
            name: tag.name,
          })),
      );
      expect(total).toBe(1);
    });

    it('should not find TagModels', async () => {
      const tagNames = ['JavaScript', 'python'];
      await tagService.createOrGetByNames(tagNames);
      const searchDto = new TagSearchDto();
      searchDto.name = '2312441';
      const [tags, total] = await tagService.search(searchDto);
      expect(tags).toHaveLength(0);
      expect(total).toBe(0);
    });
  });
});
