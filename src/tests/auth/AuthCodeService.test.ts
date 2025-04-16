import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { AuthCodeService } from '../../modules/auth/domain/services/AuthCodeService';
import { UserService } from '../../modules/user/domain/services/UserService';
import { IConfigService } from '../../modules/global/domain/interfaces/IConfigService';
import { IEventEmitterService } from '../../modules/global/domain/interfaces/IEventEmitterService';
import { RoleModel } from '../../modules/user/domain/models/RoleModel';
import { UserModel } from '../../modules/user/domain/models/UserModel';
import { AuthCodeCreateOrUpdateDto } from '../../modules/auth/domain/dtos/AuthCodeCreateOrUpdateDto';
import { AuthCodeTypeEnum } from '../../modules/auth/domain/enums/AuthCodeTypeEnum';
import { DataSource } from 'typeorm';
import { AuthCodeConfirmDto } from '../../modules/auth/domain/dtos/AuthCodeConfirmDto';
import { clearDatabase, getTestModule } from '../utils';

describe('AuthCodeService', () => {
  let authCodeService: AuthCodeService;
  let userService: UserService;
  let configService: IConfigService;
  let dataSource: DataSource;
  let eventEmitterService: IEventEmitterService;
  let user: UserModel;

  beforeAll(async () => {
    const moduleRef = await getTestModule();

    authCodeService = moduleRef.get(AuthCodeService);
    userService = moduleRef.get(UserService);
    authCodeService = moduleRef.get(AuthCodeService);
    configService = moduleRef.get(IConfigService);
    dataSource = moduleRef.get(DataSource);
    eventEmitterService = moduleRef.get(IEventEmitterService);

    await dataSource.runMigrations();
  });

  afterAll(async () => {
    await clearDatabase(dataSource);
  });

  beforeEach(async () => {
    await clearDatabase(dataSource);
    user = await userService.create({
      email: 'email@email.com',
      nickname: 'nickname',
      passwordHash: 'password',
      description: 'description',
      roles: [
        {
          id: 1,
          name: 'user',
        } as RoleModel,
      ],
    });
  });

  describe('createOrUpdate', () => {
    it('should create an authorization code', async () => {
      const dto: AuthCodeCreateOrUpdateDto = {
        email: user.email,
        type: AuthCodeTypeEnum.REGISTER_USER,
      };

      const model = await authCodeService.createOrUpdate(dto);
      const codeLength = configService.get<number>('authCode.length');
      const availableAttempts = configService.get<number>('authCode.attempts');

      expect(model.isUsed).toBeFalsy();
      expect(model.code).toHaveLength(codeLength);
      expect(model.code).toMatch(/^\d+$/);
      expect(model.availableAttempts).toBe(availableAttempts);
      expect(model.isActiveAt.getTime()).toBeGreaterThan(
        model.createdAt.getTime(),
      );
      expect(model.userId).toBe(user.id);
      expect(eventEmitterService.emit).toHaveBeenCalled();
    });

    it('should update an authorization code', async () => {
      const dto: AuthCodeCreateOrUpdateDto = {
        email: user.email,
        type: AuthCodeTypeEnum.REGISTER_USER,
      };
      const model = await authCodeService.createOrUpdate(dto);
      const updatedModel = await authCodeService.createOrUpdate(dto);
      const codeLength = configService.get<number>('authCode.length');
      const availableAttempts = configService.get<number>('authCode.attempts');

      expect(updatedModel.isActiveAt.getTime()).toBeGreaterThan(
        model.createdAt.getTime(),
      );
      expect(updatedModel.isUsed).toBeFalsy();
      expect(updatedModel.code).toHaveLength(codeLength);
      expect(updatedModel.code).toMatch(/^\d+$/);
      expect(updatedModel.availableAttempts).toBe(availableAttempts);
      expect(updatedModel.isActiveAt.getTime()).toBeGreaterThan(
        updatedModel.createdAt.getTime(),
      );
      expect(updatedModel.userId).toBe(user.id);
      expect(eventEmitterService.emit).toHaveBeenCalled();
    });
  });

  describe('confirm', () => {
    it('should confirm right code', async () => {
      const dto: AuthCodeCreateOrUpdateDto = {
        email: user.email,
        type: AuthCodeTypeEnum.REGISTER_USER,
      };
      const codeModel = await authCodeService.createOrUpdate(dto);

      const confirmDto: AuthCodeConfirmDto = {
        ...dto,
        code: codeModel.code,
      };

      const result = await authCodeService.confirm(confirmDto);
      expect(result.isConfirmed).toBeTruthy();
    });

    it('should reject wrong code', async () => {
      const dto: AuthCodeCreateOrUpdateDto = {
        email: user.email,
        type: AuthCodeTypeEnum.REGISTER_USER,
      };
      const model = await authCodeService.createOrUpdate(dto);

      const result = await authCodeService.confirm({
        ...dto,
        code: 'WRONG!',
      });

      expect(result.isConfirmed).toBeFalsy();
      expect(result.availableAttempts).toBe(model.availableAttempts - 1);
    });
  });
});
