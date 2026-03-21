import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('despesas') // tabela já criada
export class Despesas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  pagou: string | null;

  @Column()
  valor: number;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP'})
  data: Date | null;

  @Column()
  nome: string;

  @Column()
  fkaquisicao: number;

}
