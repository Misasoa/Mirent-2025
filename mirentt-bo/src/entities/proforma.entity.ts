import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { ProformaItem } from './proformat-item.entity';
import { NumericTransformer } from '../numeric.transformer'; // Vérifie le chemin du fichier

export enum ProformaStatus {
  BROUILLON = 'Brouillon',
  ENVOYEE = 'Envoyée',
  CONFIRMEE = 'Confirmée',
  ANNULEE = 'Annulée',
}

@Entity()
export class Proforma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  proformaNumber: string;

  @ManyToOne(() => Client, (client) => client.proformas, {
    eager: true,
    onDelete: 'CASCADE',
  })
  client: Client;

  @Column()
  date: Date;

  @Column({ nullable: true })
  contractReference?: string;

  @Column({ nullable: true })
  notes?: string;

  @OneToMany(() => ProformaItem, (item) => item.proforma, {
    eager: true,
    cascade: true,
  })
  items: ProformaItem[];

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new NumericTransformer(),
  })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: ProformaStatus,
    default: ProformaStatus.BROUILLON,
  })
  status: ProformaStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
