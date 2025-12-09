import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactService {
  constructor(private mailerService: MailerService) {}

  async sendContactMail(dto: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    return this.mailerService.sendMail({
      to: 'randriamboavonjyrotsy@gmail.com',
      subject: 'Nouveau message de contact',
      template: 'contact',
      context: {
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
      },
    });
  }
}
