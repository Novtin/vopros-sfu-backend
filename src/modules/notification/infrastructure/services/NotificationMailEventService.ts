import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEnum } from '../../../global/domain/enums/EventEnum';
import { IConfigService } from '../../../global/domain/interfaces/IConfigService';
import { INotificationMailerService } from '../../domain/interfaces/INotificationMailerService';
import { join } from 'path';

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
      template: './AuthCode',
      context: {
        authCode: payload.code,
        currentYear: new Date().getFullYear(),
      },
    });
  }

  @OnEvent(EventEnum.SEND_FEEDBACK)
  async onSendFeedback(payload: {
    title: string;
    text: string;
    email: string;
    filePaths?: string[];
  }): Promise<void> {
    await this.mailerService.sendMail({
      from: this.configService.get('mailer.default.from'),
      to: this.configService.get('mailer.default.from'),
      subject: 'Обратная связь',
      template: './Feedback',
      context: {
        email: payload.email,
        title: payload.title,
        text: payload.text,
      },
      attachments: payload.filePaths?.map((filePath: string) => ({
        filename: filePath,
        path: join(this.configService.get('fileLocal.storagePath'), filePath),
      })),
    });
  }
}
