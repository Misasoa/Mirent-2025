import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vehicule } from './vehicle.entity';
import { Reservation } from './reservation.entity';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  status: string;

  @OneToMany(() => Vehicule, (vehicule) => vehicule.type)
  vehiculesByType: Vehicule[];

  @OneToMany(() => Vehicule, (vehicule) => vehicule.status)
  vehicules: Vehicule[];

  @ManyToOne(() => Reservation, (reservation) => reservation.status)
  reservation: Reservation;
}
