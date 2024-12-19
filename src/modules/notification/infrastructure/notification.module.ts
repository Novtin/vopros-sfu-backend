import { Module } from '@nestjs/common';
import { INotificationRepository } from '../domain/interfaces/i-notification-repository';
import { NotificationRepository } from './repositories/notification-repository';
import { INotificationGateway } from '../domain/interfaces/i-notification-gateway';
import { NotificationGateway } from './gateways/notification.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationService } from '../domain/services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { NotificationCronService } from './services/notification-cron.service';
import { NotificationEventService } from './services/notification-event.service';
import { NotificationMailEventService } from './services/notification-mail-event.service';
import { MailerService } from '@nestjs-modules/mailer';
import { INotificationMailerService } from '../domain/interfaces/i-notification-mailer-service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  providers: [
    {
      provide: INotificationRepository,
      useClass: NotificationRepository,
    },
    {
      provide: INotificationGateway,
      useClass: NotificationGateway,
    },
    {
      provide: INotificationMailerService,
      useExisting: MailerService,
    },
    NotificationService,
    NotificationCronService,
    NotificationEventService,
    NotificationMailEventService,
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
