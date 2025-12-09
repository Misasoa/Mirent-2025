import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Region } from './region.entity';

import { NumericTransformer } from '../numeric.transformer';

@Entity()
export class Prix {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  prix: number;

  @OneToOne(() => Region, (region) => region.prix, { onDelete: 'CASCADE' })
  region: Region;
}
