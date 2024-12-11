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

  private readonly maxQueueLength = 50;
  private readonly ttlInSeconds = 60 * 60 * 24 * 30; // 30 дней в секундах

  async add(userId: string, message: INotificationMessage): Promise<void> {
    const messageStr = JSON.stringify(message);
    const key = `notifications:${userId}`;
    await this.redisRepository.lpush(key, messageStr);
    await this.redisRepository.ltrim(key, 0, this.maxQueueLength - 1);
    await this.redisRepository.expire(key, this.ttlInSeconds);
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
