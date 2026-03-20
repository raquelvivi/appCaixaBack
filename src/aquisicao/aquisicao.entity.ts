import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('aquisicao') // tabela já criada
export class Aquisicao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quant: number;

  @Column()
  nome: string;

  @Column()
  total: number;

  @Column({ type: 'date' })
  data: Date | null;

  @Column()
  fkTem: number;

}
