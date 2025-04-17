import { Injectable } from '@nestjs/common';
import { UserService } from '../../domain/services/UserService';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEnum } from '../../../global/domain/enums/EventEnum';

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

  @OnEvent(EventEnum.REGISTER_USER)
  async onRegisterUser(payload: { userId: number }) {
    await this.userService.update(payload.userId, { isConfirmed: true });
  }

  @OnEvent(EventEnum.RESET_PASSWORD_USER)
  async onResetPasswordUser(payload: { userId: number; password: string }) {
    await this.userService.updatePassword({
      userId: payload.userId,
      password: payload.password,
    });
  }
}
