import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tem') // tabela já criada
export class Tem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  valor: number;

  @Column()
  fkProduto: string;

  @Column()
  fkVendedor: string;

}
