import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async sendMail(
    @Body()
    body: {
      name: string;
      email: string;
      subject: string;
      message: string;
    },
  ) {
    return this.contactService.sendContactMail(body);
  }
}
