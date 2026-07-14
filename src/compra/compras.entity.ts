import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('comprat') // tabela já criada
export class CompraT {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    total!: number;

    @Column()
    pagamento!: string;

    @Column({ nullable:true })
    fkcliente!: number;

    @Column({ type:'date' })
    data!: Date;


}

@Entity('ItemCompra') // tabela já criada
export class ItemCompra {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quant!: number;

    @Column()
    preco!: number;

    @Column()
    fkhistoricop!: string;

    @Column()
    fkCompraT!: number;

    @Column()
    quantAntesCompra!: number;

    @Column()
    quantComprada!: number;

}

export type ComprasComItens = {
  ItemCompra: ItemCompra[],
  CompraT: CompraT[]
}