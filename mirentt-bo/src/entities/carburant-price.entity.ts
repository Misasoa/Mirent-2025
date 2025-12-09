import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TypeCarburant } from './carburant.entity';

@Entity()
export class PrixCarburant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  prix_par_litre: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  date_effective: Date;

  @OneToOne(() => TypeCarburant)
  @JoinColumn({ name: 'type_carburant_id' })
  typeCarburant: TypeCarburant;
}
