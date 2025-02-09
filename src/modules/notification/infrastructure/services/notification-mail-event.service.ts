import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEnum } from '../../../global/domain/enums/event.enum';
import { IConfigService } from '../../../global/domain/interfaces/i-config-service';
import { INotificationMailerService } from '../../domain/interfaces/i-notification-mailer-service';

@Injectable()
export class NotificationMailEventService {
  constructor(
    @Inject(INotificationMailerService)
    private readonly mailerService: INotificationMailerService,
    @Inject(IConfigService)
    private readonly configService: IConfigService,
  ) {}

  @OnEvent(EventEnum.CREATE_AUTH_CODE)
  async onCreateAuthCode(payload: {
    code: string;
    email: string;
  }): Promise<void> {
    await this.mailerService.sendMail({
      from: this.configService.get('mailer.default.from'),
      to: payload.email,
      subject: 'Код подтверждения',
      template: './auth-code',
      context: {
        authCode: payload.code,
        currentYear: new Date().getFullYear(),
      },
    });
  }
}
