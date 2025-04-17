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
import { RoleService } from '../../modules/user/domain/services/RoleService';
import { RoleEnum } from '../../modules/user/domain/enums/RoleEnum';
import { NotFoundException } from '../../modules/global/domain/exceptions/NotFoundException';

describe('RoleService', () => {
  let roleService: RoleService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await getTestModule();

    roleService = moduleRef.get(RoleService);
    dataSource = moduleRef.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await refreshDatabase(dataSource);
  });

  describe('existBy', () => {
    it('should return true if role is exists', async () => {
      const result = await Promise.all(
        Object.values(RoleEnum).map((roleName) =>
          roleService.existBy({
            name: roleName,
          }),
        ),
      );
      expect(result.every(Boolean)).toBeTruthy();
    });
    it('should return false if role is not exists', async () => {
      const result = await Promise.all(
        ['test-role', 'not-exist'].map((roleName) =>
          roleService.existBy({
            name: roleName,
          }),
        ),
      );

      expect(result.every((value) => !value)).toBeTruthy();
    });
  });

  describe('getOneBy', () => {
    it('should find RoleModel', async () => {
      const result = await Promise.all(
        Object.values(RoleEnum).map((roleName) =>
          roleService.getOneBy({
            name: roleName,
          }),
        ),
      );
      expect(result.map((role) => role.name)).toEqual(Object.values(RoleEnum));
    });
    it('should throw exception if RoleModel is not found', async () => {
      await expect(
        roleService.getOneBy({
          name: 'test-name',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
