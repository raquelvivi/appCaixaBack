import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('vendedor') // tabela já criada
export class Vendedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  site: string;

  @Column()
  cnpj: string;

  @Column()
  contato: string;

  @Column()
  vindaMes: number;

  @Column({ type: 'date' })
  criado_em: Date;

  @Column({ type: 'date' })
  atualizado_em: Date;
}
