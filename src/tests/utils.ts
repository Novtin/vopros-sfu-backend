import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TestAppModule } from './TestAppModule';
import { IEventEmitterService } from '../modules/global/domain/interfaces/IEventEmitterService';
import { INotificationMailerService } from '../modules/notification/domain/interfaces/INotificationMailerService';
import { IFileStorageRepository } from '../modules/file/domain/interfaces/IFileStorageRepository';
import { RoleModel } from '../modules/user/domain/models/RoleModel';
import { UserService } from '../modules/user/domain/services/UserService';
import { IHashService } from '../modules/auth/domain/interfaces/IHashService';
import { RoleEnum } from '../modules/user/domain/enums/RoleEnum';
import { QuestionService } from '../modules/question/domain/services/QuestionService';

export async function refreshDatabase(dataSource: DataSource): Promise<void> {
  await dataSource.query(`DROP SCHEMA public CASCADE`);
  await dataSource.query(`CREATE SCHEMA public`);
  await dataSource.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await dataSource.runMigrations();
}

let testModule: TestingModule;

export const getTestModule = async () => {
  if (!testModule) {
    testModule = await Test.createTestingModule({
      imports: [TestAppModule],
    })
      .overrideProvider(IEventEmitterService)
      .useValue({
        emit: jest.fn((event: string, ...values: any[]) => true),
      })
      .overrideProvider(INotificationMailerService)
      .useValue({
        sendEmail: jest.fn(),
      })
      .overrideProvider(IFileStorageRepository)
      .useValue({
        getReadStream: jest.fn(),
        delete: jest.fn(),
      })
      .compile();
  }
  return testModule;
};

export const createTestUser = async (
  userService: UserService,
  hashService: IHashService,
) =>
  userService.create({
    email: 'email@email.com',
    nickname: 'nickname',
    passwordHash: await hashService.makeHash('1'),
    description: 'description',
    roles: [
      {
        name: RoleEnum.USER,
      } as RoleModel,
    ],
  });

export const createTestQuestion = (
  userId: number,
  questionService: QuestionService,
) =>
  questionService.create(userId, {
    title: 'test title',
    description: 'test description',
    tagNames: ['tag', 'otherTag'],
  });
