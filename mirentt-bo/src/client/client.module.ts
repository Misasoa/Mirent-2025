import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client } from 'src/entities/client.entity';
import { ProformaModule } from 'src/proforma/proforma.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), ProformaModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService, TypeOrmModule],
})
export class ClientModule {}
