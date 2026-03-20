//Importando pacotes

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThanOrEqual, LessThan } from 'typeorm';

//Importando pacotes Locais feitos a mão
import { Despesas } from './despesa.entity';

@Injectable()
export class DespesasService {
  constructor(
    @InjectRepository(Despesas)
    private despesasRepository: Repository<Despesas>,
    private dataSource: DataSource,
  ) {}

  //Pesquisa de todos os despesas
  getDespesas(): Promise<Despesas[]> {
    return this.despesasRepository.find();
  }

  //Cadastro de Despesas
  async addDespesas (classDespesas: Despesas): Promise<Despesas> {
    let resultado;
    try {
      resultado = await this.despesasRepository.create(classDespesas);
      return await this.despesasRepository.save(resultado);
      
    } catch (error) {
      console.error('Erro ao cadastrar Despesas uto:', error);
      throw new NotFoundException(`{não foi possivel cadastrar}`);
    }
  }

  ///////////////////////////////////////// FALTA FAZER
  //Pesquisa modifica e deleta pelo nome
  /////////////////////////////////////////

  //Deletar
  async remove(codigo: string): Promise<void> {
    const result = await this.despesasRepository.delete(codigo); // cuidado para não apagar o bd completo
    if (!result) {
      throw new NotFoundException(`não deu para apagar o Despesas uto com codigo: ${codigo}`);
    }
  }
}
