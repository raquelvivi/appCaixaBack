import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('consulta') // tabela já criada
export class Consulta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    data: Date;

    @Column()
    hora: string;

    @Column()
    ano: number;

    // @Column()
    // tipo: string;

    @Column()
    pessoa: number;

    @Column({ nullable: true })
    medico: number;

    @Column()
    hospital: number;
}
