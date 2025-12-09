import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Client } from './client.entity';
import { Vehicule } from './vehicle.entity';
import { District } from './district.entity';
import { Facture } from './facture.entity';
import { Region } from './region.entity';
import { BonDeCommande } from './commande.entity';

export enum ReservationStatus {
  DEVIS = 'devis',
  CONFIRMEE = 'confirmee',
  ANNULEE = 'annulee',
  TERMINEE = 'terminee',
}

export enum CarburantPolicy {
  PLEIN_A_PLEIN = 'plein_a_plein',
  PAY_AS_YOU_USE = 'pay_as_you_use',
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  reference: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'date' })
  pickup_date: Date;

  @Column({ type: 'date' })
  return_date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.DEVIS,
  })
  status: ReservationStatus;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Vehicule, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'vehicule_id' })
  vehicule: Vehicule;

  @ManyToOne(() => Region, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'region_id' })
  location: Region;

  @Column({ type: 'int', nullable: false })
  nombreJours: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note: string;

  @Column({
    type: 'enum',
    enum: CarburantPolicy,
    default: CarburantPolicy.PLEIN_A_PLEIN,
  })
  carburant_policy: CarburantPolicy;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  carburant_depart: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  carburant_retour: number;

  @Column({ type: 'int', nullable: true })
  kilometrage_depart: number;

  @Column({ type: 'int', nullable: true })
  kilometrage_retour: number;

  @OneToOne(() => BonDeCommande, (bdc) => bdc.reservation)
  bonDeCommande: BonDeCommande;
}
