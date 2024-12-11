import { Inject, Injectable } from '@nestjs/common';
import { INotificationMessage } from '../../domain/interfaces/i-notification-message';
import { INotificationRepository } from '../../domain/interfaces/i-notification-repository';
import { IRedisRepository } from '../../../../common/interfaces/i-redis-repository';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @Inject(IRedisRepository)
    private readonly redisRepository: IRedisRepository,
  ) {}

  async add(userId: string, message: INotificationMessage): Promise<void> {
    const messageStr = JSON.stringify(message);
    const key = `notifications:${userId}`;
    await this.redisRepository.lpush(key, messageStr);
  }

  async get(userId: string): Promise<INotificationMessage[]> {
    const key = `notifications:${userId}`;
    const notifications = await this.redisRepository.lrange(key, 0, -1);
    return notifications.map((notification) => JSON.parse(notification));
  }

  async delete(userId: string): Promise<void> {
    const key = `notifications:${userId}`;
    await this.redisRepository.del(key);
  }
}
