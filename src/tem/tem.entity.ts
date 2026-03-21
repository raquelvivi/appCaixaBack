import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tem') // tabela já criada
export class Tem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  valor: number;

  @Column()
  fkproduto: string;

  @Column()
  fkvendedor: number;

}
