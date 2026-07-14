import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('produto') // tabela já criada
export class Prod {
  @PrimaryColumn()
  codigo!: string;

  @Column()
  nome!: string;

  @Column()
  categoria!: string;

  @Column()
  quantminimo!: number;

  @Column({ type:'date' })
  criado_em!: Date;

  @Column({ type:'date' })
  atualizado_em!: Date;
}


@Entity('historicoprod') // tabela já criada
export class historicoProd {
  @PrimaryColumn()
  id!: number;

  @Column()
  fkproduto!: string;

  @Column()
  fktem!: number;

  @Column({ type:'date' })
  validade!: Date | null ;

  @Column()
  quant!: number;

  @Column()
  precocompra!: number;

  @Column()
  precovenda!: number;

  @Column({ type:'date' })
  criado_em!: Date;

  @Column({ type:'date' })
  atualizado_em!: Date;
}

export type ProdutoComHistorico = {
  codigo: string;
  nome: string;
  categoria: string;
  quantminimo: number;
  validade: Date | null;
  quant: number;        // soma (total_quant)
  precocompra: number;  // preço mais recente
  precovenda: number;   // preço mais recente
};