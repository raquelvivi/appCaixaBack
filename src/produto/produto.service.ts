//Importando pacotes

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThanOrEqual, LessThan } from 'typeorm';
import { Tem } from '../tem/tem.entity';
import { Despesas } from '../despesa/despesa.entity';
import { Aquisicao } from '../aquisicao/aquisicao.entity';

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

  //Total de despesas do Mes
    async getProdutosEValorMonetario(): Promise<[number, number]> {
  
      const ValorProdutosEQuantProdutos = await this.prodRepository.query
      (`SELECT CAST(SUM(quant) AS DECIMAL(10,2)) AS QuantidadeProdutos, 
        CAST(SUM(quant * precocompra) AS DECIMAL(10,2)) AS ValorDoEstoque FROM produto`);
  
      return [ValorProdutosEQuantProdutos[0].quantidadeprodutos ?? 0, ValorProdutosEQuantProdutos[0].valordoestoque ?? 0];
    }


  //Cadastro de produtos
  async addProd(prod: Prod, vendedor: number): Promise<Prod> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction(); //conexao aberta

    let resultado;
    try {
      // Salvar o produto
      resultado = await queryRunner.manager.save(Prod, prod);

      // Salvar o tem, relacionamento de produto com vendedor
      const resutTem = await queryRunner.manager.save(Tem, {
        valor: prod.precocompra,
        fkproduto: prod.codigo,
        fkvendedor: vendedor,
      });

      
      // Salvar a aquisição
      const aquisicao = await queryRunner.manager.save(Aquisicao, {
        quant: prod.quant,
        total: prod.precocompra * prod.quant,
        nome: 'compra de mercadoria',
        fktem: resutTem.id,
      });

      // Salvar a despesa
      await queryRunner.manager.save(Despesas, {
        valor: prod.precocompra * prod.quant,
        nome: 'compra de mercadoria',
        fkaquisicao: aquisicao.id,
      });

      await queryRunner.commitTransaction(); //conexao fechada
      return resultado;
    } catch (err) {
      await queryRunner.rollbackTransaction(); //deu merda, desfaz tudo
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  //Editar a base do codigo de barras
  async replaceVali(codigo: string): Promise<boolean> {
    const result = await this.prodRepository.update({ codigo: codigo }, { validade: null, quant: 0 });

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
