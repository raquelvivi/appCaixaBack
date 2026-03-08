import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('produto') // tabela já criada
export class Prod {
  @PrimaryColumn()
  codigo: string;

  @Column()
  nome: string;

  @Column({ type: 'date' })
  validade: Date;

  @Column()
  quant: number;

  @Column()
  precocompra: number;

  @Column()
  precovenda: number;

  @Column()
  categoria: string;

  @Column()
  quantminimo: number;

  @Column({ type: 'date' })
  criado_em: Date;

  @Column({ type: 'date' })
  atualizado_em: Date;
}
