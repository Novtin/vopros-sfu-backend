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

  @OnEvent(EventEnum.REGISTER_USER)
  async onRegisterUser(payload: {
    email: string;
    emailHash: string;
  }): Promise<void> {
    const params = new URLSearchParams();
    params.set('emailHash', encodeURIComponent(payload.emailHash));
    const confirmationUrl = `${this.configService.get('http.frontendUrl')}/confirm-email?${params.toString()}`;
    await this.mailerService.sendMail({
      from: this.configService.get('mailer.default.from'),
      to: payload.email,
      subject: 'Подтверждение почты',
      template: './confirmation',
      context: {
        confirmationUrl,
      },
    });
  }
}
