// proforma-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Vehicule } from './vehicle.entity';
import { Proforma } from './proforma.entity';
import { Region } from './region.entity';
import { Prix } from './prix.entity';
import { NumericTransformer } from '../numeric.transformer';

@Entity()
export class ProformaItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Proforma, (proforma) => proforma.items)
  @JoinColumn({ name: 'proformaId' })
  proforma: Proforma;

  @ManyToOne(() => Vehicule, { eager: true })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicule;

  @ManyToOne(() => Region, { eager: true })
  @JoinColumn({ name: 'regionId' })
  region: Region;

  @ManyToOne(() => Prix, { eager: true })
  @JoinColumn({ name: 'prixId' })
  prix: Prix;

  @Column({ type: 'date' })
  dateDepart: Date;

  @Column({ type: 'date' })
  dateRetour: Date;

  @Column({ type: 'integer' })
  nombreJours: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new NumericTransformer(),
  })
  subTotal: number;
}
