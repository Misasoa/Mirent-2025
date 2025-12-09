import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { Paiement } from './paiement.entity';
import { Facture } from './facture.entity';

@Entity()
export class BonDeCommande {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  reference: string;

  @OneToOne(() => Reservation, (reservation) => reservation.bonDeCommande, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  reservation: Reservation;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @OneToMany(() => Paiement, (paiement) => paiement.bdc)
  paiements: Paiement[];

  @OneToOne(() => Facture, (factures) => factures.bdc)
  facture: Facture;
}
