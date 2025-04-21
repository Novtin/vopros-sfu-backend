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
import { NotificationService } from '../../modules/notification/domain/services/NotificationService';
import { UserService } from '../../modules/user/domain/services/UserService';
import { UserModel } from '../../modules/user/domain/models/UserModel';
import { IHashService } from '../../modules/auth/domain/interfaces/IHashService';
import { NotificationSaveDto } from '../../modules/notification/domain/dtos/NotificationSaveDto';
import { IEventEmitterService } from '../../modules/global/domain/interfaces/IEventEmitterService';
import { EventEnum } from '../../modules/global/domain/enums/EventEnum';
import { subDays } from 'date-fns';
import { NotificationSearchDto } from '../../modules/notification/domain/dtos/NotificationSearchDto';
import { orderBy as _orderBy } from 'lodash';

describe('FileService', () => {
  let notificationService: NotificationService;
  let eventEmitterService: IEventEmitterService;
  let dataSource: DataSource;
  let userService: UserService;
  let hashService: IHashService;
  let user: UserModel;

  const createTestNotification = async () =>
    notificationService.createAndSend({
      userId: user.id,
      payload: {
        someData: 'someData',
      },
    });

  beforeAll(async () => {
    const moduleRef = await getTestModule();

    notificationService = moduleRef.get(NotificationService);
    userService = moduleRef.get(UserService);
    hashService = moduleRef.get(IHashService);
    dataSource = moduleRef.get(DataSource);
    eventEmitterService = moduleRef.get(IEventEmitterService);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await refreshDatabase(dataSource);
    user = await createTestUser(userService, hashService);
  });

  describe('createAndSend', () => {
    it('should create FileModel and call eventEmitterService.emit', async () => {
      const dto: NotificationSaveDto = {
        userId: user.id,
        payload: {
          someData: 'someData',
        },
      };
      const notification = await notificationService.createAndSend(dto);

      expect(notification.payload).toEqual(dto.payload);
      expect(notification.userId).toEqual(dto.userId);
      expect(notification.isViewed).toBeFalsy();
      expect(eventEmitterService.emit).toBeCalledWith(
        EventEnum.SEND_NOTIFICATION,
        notification,
      );
    });
  });

  describe('view', () => {
    it('should set isViewed to true', async () => {
      const notification = await createTestNotification();
      await notificationService.view(notification);
      const searchDto = new NotificationSearchDto();
      searchDto.id = notification.id;
      const [updatedNotificationArray] =
        await notificationService.search(searchDto);
      expect(updatedNotificationArray[0].isViewed).toBeTruthy();
      expect(updatedNotificationArray[0].id).toEqual(notification.id);
    });
  });

  describe('search', () => {
    it('should find NotificationModel', async () => {
      const notification = await createTestNotification();
      const searchDto = new NotificationSearchDto();
      searchDto.id = notification.id;
      searchDto.userId = notification.userId;
      searchDto.isViewed = notification.isViewed;
      const [notificationArray, total] =
        await notificationService.search(searchDto);
      expect(notificationArray[0]).toEqual(notification);
      expect(total).toBe(1);
    });
  });

  describe('deleteOld', () => {
    it('should delete old NotificationModels', async () => {
      const notifications = await Promise.all(
        Array.from({ length: 2 }, createTestNotification),
      );

      await dataSource.query(
        `UPDATE notification SET "createdAt" = $1, "isViewed" = TRUE WHERE id = $2`,
        [subDays(new Date(notifications[0].createdAt), 5), notifications[0].id],
      );
      await dataSource.query(
        `UPDATE notification SET "createdAt" = $1 WHERE id = $2`,
        [
          subDays(new Date(notifications[1].createdAt), 25),
          notifications[1].id,
        ],
      );

      await notificationService.deleteOld();

      const [notificationArray, total] = await notificationService.search(
        new NotificationSearchDto(),
      );
      expect(notificationArray).toHaveLength(0);
      expect(total).toBe(0);
    });

    it('should not delete any NotificationModels', async () => {
      const notifications = await Promise.all(
        Array.from({ length: 2 }, createTestNotification),
      );

      await notificationService.deleteOld();

      const [notificationArray, total] = await notificationService.search(
        new NotificationSearchDto(),
      );
      expect(_orderBy(notificationArray, 'id')).toEqual(
        _orderBy(notifications, 'id'),
      );
      expect(total).toBe(notifications.length);
    });
  });
});
