//Importando pacotes

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Importando pacotes Locais feitos a mão
import { Prod } from './produto.entity';

@Injectable()
export class ProdService {
  constructor(
    @InjectRepository(Prod)
    private prodRepository: Repository<Prod>,
  ) {}

  //Pesquisa de todos os produtos

  getProds(): Promise<Prod[]> {
    return this.prodRepository.find();
  }

  //Pesquisa de produtos com o codigo de barras

  async getProd(codigo: string): Promise<Prod> {
    let algo = await this.prodRepository.findOneBy({ codigo }); // pesquisa apenas um produto

    if (!algo) {
      // Se tiver algum erro apareça mensagem de erro com o codigo de barras
      throw new NotFoundException(`{o codigo com o numero ${codigo} não foi achado}`);
    }
    return algo;
  }
  ///////////////////////////////////////// FALTA FAZER
  //Pesquisa de produtos com o nome
  /////////////////////////////////////////

  //Cadastro de produtos

  async addProd(prod: Prod): Promise<Prod> {
    let algo = await this.prodRepository.save(prod);

    if (!algo) {
      // Se tiver algum erro apareça mensagem de erro
      throw new NotFoundException(`{não foi possivel cadastrar}`);
    }
    return algo;
  }

  ///////////////////////////////////////// FALTA FAZER
  //Pesquisa modifica e deleta pelo nome
  /////////////////////////////////////////

  //Editar a base do codigo de barras
  async replaceProd(codigo: string, prod: Prod): Promise<Prod> {
    //findOne busca apenas um para não dar problema. como modificar o banco inteiro

    const existingProd = await this.prodRepository.findOne({ where: { codigo } });

    if (!existingProd) {
      throw new NotFoundException(`Usuário com codigo ${codigo} não encontrado`);
    }

    // substitui os dados
    await this.prodRepository.update(codigo, prod);

    // busca o registro atualizado
    let algo = await this.prodRepository.findOne({ where: { codigo } });

    if (!algo) {
      throw new NotFoundException(`{não foi possivel achar o dado modificado}`);
    }
    return algo;
  }

  //Deletar
  async remove(codigo: string): Promise<void> {
    const result = await this.prodRepository.delete(codigo); // cuidado para não apagar o bd completo
    if (!result) {
      throw new NotFoundException(`não deu para apagar o produto com codigo: ${codigo}`);
    }
  }
}
