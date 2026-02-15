
import { Injectable, NotFoundException } from '@nestjs/common';


import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consulta } from './consulta.entity';

// export type Consulta = {
//   id: number;
//   name: string;
//   age: number;
//   uf: string;
// }


@Injectable()
export class ConsultaService {

  constructor(
    @InjectRepository(Consulta)
    private consultaRepository: Repository<Consulta>,
  ) { }

  // Consultas: Consulta[] = [];



  async getConsultas(): Promise<Consulta[]> {
    let algo = await this.consultaRepository.query(
      `SELECT p.nome AS "paciente",
        p.id, c.hora, c.data,
        m.nome AS "medico",
        h.nome AS "hospital"
        from pessoa p 
        inner join consulta c on p.id = c.pessoa
        inner join medico m on c.medico = m.id
        inner join hospital h on c.hospital = h.id
    `)

    return algo
  }



  async getConsulta(id: number): Promise<Consulta> {

    let algo = await this.consultaRepository.findOneBy({ id });

    if (!algo) {
      throw new NotFoundException(`{o id com o numero ${id} não foi achado}`)
    }
    return algo
  }

  async getConsultaPessoa(id: number) {

    let algo = await this.consultaRepository.query(
      `SELECT p.nome AS "paciente",
        p.id, c.hora, c.data,
        m.nome AS "medico",
        h.nome AS "hospital"
        from pessoa p 
        inner join consulta c on p.id = c.pessoa
        inner join medico m on c.medico = m.id
        inner join hospital h on c.hospital = h.id
        WHERE p.id = $1
    `, [id])

    if (!algo) {
      throw new NotFoundException(`{o id com o numero ${id} não foi achado}`)
    }
    return algo
  }


  async addConsulta(consulta: Consulta): Promise<Consulta> {
    let algo = await this.consultaRepository.save(consulta);

    if (!algo) {
      throw new NotFoundException(`{não foi possivel cadastrar}`)
    }
    return algo
  }




  async replaceConsulta(id: number, consulta: Consulta): Promise<Consulta> {
    const existingConsulta = await this.consultaRepository.findOne({ where: { id } });

    if (!existingConsulta) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }

    // substitui os dados
    await this.consultaRepository.update(id, consulta);

    // busca o registro atualizado
    let algo = await this.consultaRepository.findOne({ where: { id } });

    if (!algo) {
      throw new NotFoundException(`{não foi possivel achar o dado modificado}`)
    }
    return algo

  }

  async remove(id: number): Promise<void> {
    const result = await this.consultaRepository.delete(id);
    if (!result) {
      throw new NotFoundException(`não deu para apagar o usuario com id: ${id}`);
    }
  }


}
