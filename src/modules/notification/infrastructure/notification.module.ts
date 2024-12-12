import { Module } from '@nestjs/common';
import { INotificationRepository } from '../domain/interfaces/i-notification-repository';
import { NotificationRepository } from './repositories/notification-repository';
import { INotificationGateway } from '../domain/interfaces/i-notification-gateway';
import { NotificationGateway } from './gateways/notification.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationService } from '../domain/services/notification.service';
import { NotificationController } from './controllers/notification.controller';

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
    NotificationService,
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
