import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Prix } from './prix.entity';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom_region: string;

  @Column({ nullable: true })
  nom_district?: string;

  @OneToOne(() => Prix, (prix) => prix.region, {
    eager: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  prix: Prix | null;
}
