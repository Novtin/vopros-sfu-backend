import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TestAppModule } from './test.app.module';
import { IEventEmitterService } from '../modules/global/domain/interfaces/i-event-emitter-service';
import { INotificationMailerService } from '../modules/notification/domain/interfaces/i-notification-mailer-service';
import { IFileStorageRepository } from '../modules/file/domain/interfaces/i-file-storage-repository';

export async function clearDatabase(dataSource: DataSource) {
  for (const entity of dataSource.entityMetadatas) {
    if (entity.tableName !== 'role') {
      await dataSource.query(`TRUNCATE "${entity.tableName}" CASCADE;`);
    }
  }
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
