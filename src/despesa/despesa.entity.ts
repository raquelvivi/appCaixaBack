import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('despesas') // tabela já criada
export class Despesas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pagou: string | null;

  @Column()
  valor: number;

  @Column({ type: 'date' })
  data: Date | null ;

  @Column()
  nome: string;

  @Column()
  fkAquisicao: number;

}
