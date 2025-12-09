import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendProforma(
    to: string,
    proforma: any,
    pdfBuffer: Buffer,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: `Votre facture proforma N° ${proforma.proformaNumber}`,
      template: './proforma',
      context: {
        proforma: proforma,
      },
      attachments: [
        {
          filename: `proforma_${proforma.proformaNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
  }
}
