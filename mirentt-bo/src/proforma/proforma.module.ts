import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proforma } from 'src/entities/proforma.entity';
import { ProformaItem } from 'src/entities/proformat-item.entity';
import { ProformaService } from './proforma.service';
import { ProformaController } from './proforma.controller';
import { Vehicule } from 'src/entities/vehicle.entity';
import { Region } from 'src/entities/region.entity';
import { Prix } from 'src/entities/prix.entity';
import { Status } from 'src/entities/status.entity';
import { Client } from 'src/entities/client.entity';
import { Type } from 'src/entities/type.entity';
import { MailService } from 'src/mailer/mailer.service';
import { PdfService } from 'src/pdf/pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proforma,
      ProformaItem,
      Vehicule,
      Region,
      Prix,
      Status,
      Client,
      Type,
    ]),
  ],
  providers: [ProformaService, MailService, PdfService],
  controllers: [ProformaController],
  exports: [ProformaService],
})
export class ProformaModule {}
