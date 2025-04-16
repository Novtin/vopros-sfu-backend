export const INotificationMailerService = 'INotificationMailerService';

export interface INotificationMailerService {
  sendMail(sendMailOptions: {
    from: any;
    to: any;
    subject: string;
    template: string;
    context: { [key: string]: any };
  }): Promise<any>;
}
