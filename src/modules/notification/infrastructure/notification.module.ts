import { Module } from '@nestjs/common';
import { INotificationRepository } from '../domain/interfaces/i-notification-repository';
import { NotificationRepository } from './repositories/notification-repository';
import { INotificationService } from '../domain/interfaces/i-notification-service';
import { NotificationService } from './service/notification.service';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { IRedisRepository } from '../../../common/interfaces/i-redis-repository';

@Module({
  providers: [
    {
      provide: IRedisRepository,
      useFactory: (configService: ConfigService) =>
        new Redis({
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        }),
      inject: [ConfigService],
    },
    {
      provide: INotificationRepository,
      useClass: NotificationRepository,
    },
    {
      provide: INotificationService,
      useClass: NotificationService,
    },
  ],
  exports: [INotificationService],
})
export class NotificationModule {}
