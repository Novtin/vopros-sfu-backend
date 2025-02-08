import { Injectable } from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEnum } from '../../../global/domain/enums/event.enum';

@Injectable()
export class UserEventService {
  constructor(private readonly userService: UserService) {}

  @OnEvent(EventEnum.ONLINE_USER)
  async onOnlineUser(userId: number) {
    await this.userService.update(userId, { isOnline: true });
  }

  @OnEvent(EventEnum.OFFLINE_USER)
  async onOfflineUser(userId: number) {
    await this.userService.update(userId, {
      isOnline: false,
      wasOnlineAt: new Date(),
    });
  }
}
