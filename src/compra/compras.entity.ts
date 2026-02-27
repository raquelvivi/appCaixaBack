import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('CompraT') // tabela já criada
export class CompraT {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    total: number;

    @Column()
    pagamento: string;

    @Column({ nullable: true })
    fkCliente: number;

}

@Entity('ItemCompra') // tabela já criada
export class ItemCompra {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    quantComprada: number;

    @Column()
    quantAntesCompra: number;

    @Column()
    preco: number;

    @Column()
    fkProduto: string;

    @Column()
    fkCompraT: number;

}

export type ComprasComItens = {
  ItemCompra: ItemCompra[],
  CompraT: CompraT[]
}