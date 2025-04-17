import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TestAppModule } from './TestAppModule';
import { IEventEmitterService } from '../modules/global/domain/interfaces/IEventEmitterService';
import { INotificationMailerService } from '../modules/notification/domain/interfaces/INotificationMailerService';
import { IFileStorageRepository } from '../modules/file/domain/interfaces/IFileStorageRepository';

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
