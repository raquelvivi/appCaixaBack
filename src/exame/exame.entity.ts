import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('exame') // tabela já criada
export class Exame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  data: Date;

  @Column()
  hora: string;

  @Column()
  ano: number;

  @Column()
  tipo: string;

  @Column()
  resultado: string;

  @Column({ type: 'bytea', nullable: true }) // PostgreSQL
  documento: Buffer;

  @Column()
  pessoa: number;

  @Column({ nullable: true })
  medico: number;

  @Column()
  hospital: number;
}
