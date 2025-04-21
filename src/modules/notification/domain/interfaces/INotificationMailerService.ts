export const INotificationMailerService = 'INotificationMailerService';

export interface INotificationMailerService {
  sendMail(sendMailOptions: {
    from: any;
    to: any;
    subject: string;
    template?: string;
    text?: string;
    context?: { [key: string]: any };
    attachments?: {
      filename: string;
      path: string;
    }[];
  }): Promise<any>;
}
