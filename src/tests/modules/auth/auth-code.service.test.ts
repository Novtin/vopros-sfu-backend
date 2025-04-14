import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { AuthCodeService } from '../../../modules/auth/domain/services/auth-code.service';
import { UserService } from '../../../modules/user/domain/services/user.service';
import { IConfigService } from '../../../modules/global/domain/interfaces/i-config-service';
import { IEventEmitterService } from '../../../modules/global/domain/interfaces/i-event-emitter-service';
import { RoleModel } from '../../../modules/user/domain/models/role.model';
import { UserModel } from '../../../modules/user/domain/models/user.model';
import { CreateOrUpdateAuthCodeDto } from '../../../modules/auth/domain/dtos/create-or-update-auth-code.dto';
import { AuthCodeTypeEnum } from '../../../modules/auth/domain/enums/auth-code-type.enum';
import { DataSource } from 'typeorm';
import { ConfirmAuthCodeDto } from '../../../modules/auth/domain/dtos/confirm-auth-code.dto';
import { clearDatabase, getTestModule } from '../../utils';

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
    //await dataSource.destroy();
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
      const dto: CreateOrUpdateAuthCodeDto = {
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
      const dto: CreateOrUpdateAuthCodeDto = {
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
      const dto: CreateOrUpdateAuthCodeDto = {
        email: user.email,
        type: AuthCodeTypeEnum.REGISTER_USER,
      };
      const codeModel = await authCodeService.createOrUpdate(dto);

      const confirmDto: ConfirmAuthCodeDto = {
        ...dto,
        code: codeModel.code,
      };

      const result = await authCodeService.confirm(confirmDto);
      expect(result.isConfirmed).toBeTruthy();
    });

    it('should reject wrong code', async () => {
      const dto: CreateOrUpdateAuthCodeDto = {
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
