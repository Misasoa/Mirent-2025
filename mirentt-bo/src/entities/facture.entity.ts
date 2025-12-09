import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Paiement } from './paiement.entity';
import { BonDeCommande } from './commande.entity';

@Entity()
export class Facture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: string;

  @ManyToOne(() => BonDeCommande, (bdc) => bdc.facture, { onDelete: 'CASCADE' })
  bdc: BonDeCommande;

  @OneToMany(() => Paiement, (paiement) => paiement.facture)
  paiements: Paiement[];

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @CreateDateColumn()
  date_facture: Date;
}
