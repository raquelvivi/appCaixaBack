//Importando pacotes

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThanOrEqual, LessThan } from 'typeorm';

//Importando pacotes Locais feitos a mão
import { Prod } from './produto.entity';

@Injectable()
export class ProdService {
  constructor(
    @InjectRepository(Prod)
    private prodRepository: Repository<Prod>,
    private dataSource: DataSource,
  ) {}

  //Pesquisa de todos os produtos
  getProds(): Promise<Prod[]> {
    return this.prodRepository.find();
  }

  //Pesquisa de produtos com o codigo de barras
  async getProd(codigo: string): Promise<Prod> {
    const algo = await this.prodRepository.query(`SELECT * FROM Produto WHERE codigo = $1`, [codigo]);

    return algo;
  }

  //Pesquisa de produtos com o nome
  async getProdNome(codigo: string): Promise<Prod> {
    const resultado = await this.prodRepository.query('SELECT * FROM Produto WHERE unaccent(nome) ILIKE unaccent($1)', [
      `%${codigo}%`,
    ]);
    return resultado;
  }

  async getProdValidade(): Promise<Prod[]> {
    let data = new Date();
    data.setDate(data.getDate() + 7); // Adiciona 7 dias à data atual
    console.log(data);

    const GetValidade = await this.prodRepository.find({
      where: {
        validade: LessThan(data),
      },
      order: {
        validade: 'ASC',
      },
    });

    return GetValidade;
  }

  async getProdRepo(): Promise<Prod[]> {
    try {
      const algo = await this.prodRepository
        .createQueryBuilder('produto') // "produto" é o apelido da tabela
        .where('produto.quant <= produto.quantminimo') // Comparação direta entre colunas
        .getMany();

      return algo;
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao buscar produtos com estoque baixo.`);
    }
  }

  //Cadastro de produtos
  async addProd(prod: Prod): Promise<Prod> {
    let resultado;
    try {
      resultado = await this.prodRepository.create(prod);
      return await this.prodRepository.save(resultado);
      
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      throw new NotFoundException(`{não foi possivel cadastrar}`);
    }
  }

  //Editar a base do codigo de barras
  async replaceVali(codigo: string): Promise<boolean> {
    const result = await this.prodRepository.update(
    { codigo: codigo },
    { validade: null, quant: 0 }
  );

  return result.affected !== 0;
  }

  ///////////////////////////////////////// FALTA FAZER
  //Pesquisa modifica e deleta pelo nome
  /////////////////////////////////////////

  //Deletar
  async remove(codigo: string): Promise<void> {
    const result = await this.prodRepository.delete(codigo); // cuidado para não apagar o bd completo
    if (!result) {
      throw new NotFoundException(`não deu para apagar o produto com codigo: ${codigo}`);
    }
  }
}
