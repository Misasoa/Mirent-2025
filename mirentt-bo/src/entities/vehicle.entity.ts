import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from './type.entity';
import { Status } from './status.entity';
//import { Reservation } from './reservation.entity';
import { TypeCarburant } from './carburant.entity';

@Entity()
export class Vehicule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nom: string;

  @Column({ nullable: false })
  marque: string;

  @Column({ nullable: false })
  modele: string;

  @Column({ nullable: false, unique: true })
  immatriculation: string;

  @Column()
  nombrePlace: number;

  @ManyToOne(() => Type, (type) => type.vehicules, { eager: true })
  type: Type;

  @ManyToOne(() => Status, (status) => status.vehicules, { eager: true })
  status: Status;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  /*@OneToMany(() => Reservation, (reservation) => reservation.vehicle)
  reservations: Reservation[];*/

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance_moyenne: number;

  @Column({ type: 'date', nullable: true })
  derniere_visite: Date;

  @ManyToOne(() => TypeCarburant, { eager: true, nullable: true })
  @JoinColumn({ name: 'type_carburant_id' })
  typeCarburant: TypeCarburant;
}
