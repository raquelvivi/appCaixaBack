//Importando pacotes

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThanOrEqual, LessThan } from 'typeorm';

//Importando pacotes Locais feitos a mão
import { Aquisicao } from './aquisicao.entity';

@Injectable()
export class AquisicaoService {
  constructor(
    @InjectRepository(Aquisicao)
    private aquisicaoRepository: Repository<Aquisicao>,
    private dataSource: DataSource,
    
  ) {}

  //Pesquisa de todos os Aquisicao
  async getAquisicao(): Promise<Aquisicao[]> {
    return await this.aquisicaoRepository.find();
  }

  //Cadastro de produtos
  async addAquisicao(classAquisicao: Aquisicao): Promise<Aquisicao> {
    let resultado;
    try {
      resultado = await this.aquisicaoRepository.create(classAquisicao);
      return await this.aquisicaoRepository.save(resultado);
      
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      throw new NotFoundException(`{não foi possivel cadastrar}`);
    }
  }

  ///////////////////////////////////////// FALTA FAZER
  //Pesquisa modifica e deleta pelo nome
  /////////////////////////////////////////

  //Deletar
  async remove(codigo: string): Promise<void> {
    const result = await this.aquisicaoRepository.delete(codigo); // cuidado para não apagar o bd completo
    if (!result) {
      throw new NotFoundException(`não deu para apagar o produto com codigo: ${codigo}`);
    }
  }
}
