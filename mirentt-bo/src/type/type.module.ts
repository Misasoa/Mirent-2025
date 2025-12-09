import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type } from 'src/entities/type.entity';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Type])],
  providers: [TypeService],
  controllers: [TypeController],
  exports: [TypeService],
})
export class TypeModule {}
