import { Module } from '@nestjs/common';
import { INotificationRepository } from '../domain/interfaces/INotificationRepository';
import { NotificationRepository } from './repositories/NotificationRepository';
import { NotificationGateway } from './gateways/NotificationGateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/NotificationEntity';
import { NotificationService } from '../domain/services/NotificationService';
import { NotificationController } from './controllers/NotificationController';
import { NotificationCronService } from './services/NotificationCronService';
import { NotificationEventService } from './services/NotificationEventService';
import { NotificationMailEventService } from './services/NotificationMailEventService';
import { MailerService } from '@nestjs-modules/mailer';
import { INotificationMailerService } from '../domain/interfaces/INotificationMailerService';
import { FileModule } from '../../file/infrastructure/FileModule';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity]), FileModule],
  providers: [
    {
      provide: INotificationRepository,
      useClass: NotificationRepository,
    },
    {
      provide: INotificationMailerService,
      useExisting: MailerService,
    },
    NotificationService,
    NotificationCronService,
    NotificationEventService,
    NotificationMailEventService,
    NotificationGateway,
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
