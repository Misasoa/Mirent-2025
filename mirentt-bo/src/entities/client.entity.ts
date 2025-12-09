import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Proforma } from './proforma.entity';
import { Devis } from './devis.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  logo: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Proforma, (proforma) => proforma.client)
  proformas: Proforma[];

  @OneToMany(() => Devis, (devis) => devis.client)
  devis: Devis[];
}
