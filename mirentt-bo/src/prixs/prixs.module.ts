import { Module } from '@nestjs/common';
import { PrixsService } from './prixs.service';
import { PrixsController } from './prixs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prix } from 'src/entities/prix.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prix])],
  controllers: [PrixsController],
  providers: [PrixsService],
})
export class PrixsModule {}
