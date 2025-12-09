import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { BonDeCommande } from './commande.entity';
import { Facture } from './facture.entity';

export enum PaymentMethod {
  ESPECES = 'especes',
  MOBILE_MONEY = 'mobile_money',
  CARTE_BANCAIRE = 'carte_bancaire',
}

@Entity()
export class Paiement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  methode: PaymentMethod;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference_transaction: string | null;

  @ManyToOne(() => BonDeCommande, (bdc) => bdc.paiements, {
    onDelete: 'CASCADE',
  })
  bdc: BonDeCommande;

  @ManyToOne(() => Facture, (facture) => facture.paiements)
  facture: Facture | null;

  @CreateDateColumn()
  date_paiement: Date;
}
