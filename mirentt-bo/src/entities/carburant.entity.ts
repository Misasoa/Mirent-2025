import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TypeCarburant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nom: string;
}
