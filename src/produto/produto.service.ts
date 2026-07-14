//Importando pacotes

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThanOrEqual, LessThan } from 'typeorm';
import { Tem } from '../tem/tem.entity';
import { Despesas } from '../despesa/despesa.entity';


//Importando pacotes Locais feitos a mão
import { Prod, historicoProd, ProdutoComHistorico } from './produto.entity';

@Injectable()
export class ProdService {
  constructor(
    @InjectRepository(Prod)
    private prodRepository: Repository<Prod>,
    @InjectRepository(historicoProd)
    private histoRepository: Repository<historicoProd>,

    private dataSource: DataSource,

  ) {}

  async getProdutosEValorMonetario(): Promise<[number, number]> {
    let ValorProdutosEQuantProdutos = await this.histoRepository.query(
      `select FLOOR(sum(quant)) as QuantidadeProdutos, 
    FLOOR(sum(quant * precovenda)) as ValorDoEstoque
    from historicoprod 
    where quant > 0`
)


     return [ValorProdutosEQuantProdutos[0].quantidadeprodutos ?? 0, ValorProdutosEQuantProdutos[0].valordoestoque ?? 0];
  }

  //Pesquisa de todos os produtos
  async getProds(): Promise<ProdutoComHistorico[]> {
    let resultado = await this.histoRepository.query(
      `
        WITH historico_ordenado AS (
            SELECT 
                fkproduto,
                quant,
                validade,
                precocompra,
                precovenda,
                -- Cria um ranking para pegar o preço mais recente (criado_em mais novo)
                ROW_NUMBER() OVER(PARTITION BY fkproduto ORDER BY criado_em DESC) as rn_recente,
                -- Cria um ranking para pegar a validade mais próxima de vencer
                ROW_NUMBER() OVER(PARTITION BY fkproduto ORDER BY validade ASC) as rn_validade
            FROM historicoprod
            WHERE quant > 0
        ),
        dados_produto AS (
            SELECT 
                fkproduto,
                SUM(quant) as total_quant,
                MIN(validade) as validade_mais_antiga, -- Pega a validade mais próxima de vencer
                MAX(CASE WHEN rn_recente = 1 THEN precocompra END) as ultimo_preco_compra,
                MAX(CASE WHEN rn_recente = 1 THEN precovenda END) as ultimo_preco_venda
            FROM historico_ordenado
            GROUP BY fkproduto
        )
        SELECT 
            p.codigo, 
            p.nome, 
            p.categoria, 
            p.quantminimo,
            dp.validade_mais_antiga as validade, 
            dp.total_quant as quant, 
            dp.ultimo_preco_compra as precocompra, 
            dp.ultimo_preco_venda as precovenda
        FROM produto p
        JOIN dados_produto dp ON dp.fkproduto = p.codigo
        ORDER by nome ASC;
        `);
    return resultado;
  }

  //Pesquisa de produtos com o codigo de barras
  async getProd(codigo: string): Promise<Prod> {
    const algo = await this.prodRepository.query(`
      
      WITH historico_ordenado AS (
            SELECT 
                fkproduto,
                quant,
                validade,
                precocompra,
                precovenda,
                -- Cria um ranking para pegar o preço mais recente (criado_em mais novo)
                ROW_NUMBER() OVER(PARTITION BY fkproduto ORDER BY criado_em DESC) as rn_recente,
                -- Cria um ranking para pegar a validade mais próxima de vencer
                ROW_NUMBER() OVER(PARTITION BY fkproduto ORDER BY validade ASC) as rn_validade
            FROM historicoprod
            WHERE quant > 0
        ),
        dados_produto AS (
            SELECT 
                fkproduto,
                SUM(quant) as total_quant,
                MIN(validade) as validade_mais_antiga, -- Pega a validade mais próxima de vencer
                MAX(CASE WHEN rn_recente = 1 THEN precocompra END) as ultimo_preco_compra,
                MAX(CASE WHEN rn_recente = 1 THEN precovenda END) as ultimo_preco_venda
            FROM historico_ordenado
            GROUP BY fkproduto
        )
        SELECT 
            p.codigo, 
            p.nome, 
            p.categoria, 
            p.quantminimo,
            dp.validade_mais_antiga as validade, 
            dp.total_quant as quant, 
            dp.ultimo_preco_compra as precocompra, 
            dp.ultimo_preco_venda as precovenda
        FROM produto p
        JOIN dados_produto dp ON dp.fkproduto = p.codigo
        WHERE p.codigo = $1;
        `, [codigo]);

    return algo;
  }

  //Pesquisa de produtos com o nome
  async getProdNome(codigo: string): Promise<Prod> {
    const resultado = await this.prodRepository.query(`
      WITH historico_ordenado AS (
            SELECT 
                fkproduto,
                quant,
                validade,
                precocompra,
                precovenda,
                -- Cria um ranking para pegar o preço mais recente (criado_em mais novo)
                ROW_NUMBER() OVER(PARTITION BY fkproduto ORDER BY criado_em DESC) as rn_recente,
                -- Cria um ranking para pegar a validade mais próxima de vencer
                ROW_NUMBER() OVER(PARTITION BY fkproduto ORDER BY validade ASC) as rn_validade
            FROM historicoprod
            WHERE quant > 0
        ),
        dados_produto AS (
            SELECT 
                fkproduto,
                SUM(quant) as total_quant,
                MIN(validade) as validade_mais_antiga, -- Pega a validade mais próxima de vencer
                MAX(CASE WHEN rn_recente = 1 THEN precocompra END) as ultimo_preco_compra,
                MAX(CASE WHEN rn_recente = 1 THEN precovenda END) as ultimo_preco_venda
            FROM historico_ordenado
            GROUP BY fkproduto
        )
        SELECT 
            p.codigo, 
            p.nome, 
            p.categoria, 
            p.quantminimo,
            dp.validade_mais_antiga as validade, 
            dp.total_quant as quant, 
            dp.ultimo_preco_compra as precocompra, 
            dp.ultimo_preco_venda as precovenda
        FROM produto p
        JOIN dados_produto dp ON dp.fkproduto = p.codigo
        WHERE unaccent(p.nome) ILIKE unaccent($1)
      `, [
      `%${codigo}%`,
    ]);
    return resultado;
  }

  async getProdValidade(): Promise<historicoProd[]> {
    const hoje = new Date();
  
  // 2. Calcula a data limite (Daqui a 7 dias)
  const dataLimite = new Date();
  dataLimite.setDate(hoje.getDate() + 7);

  // 3. Executamos a query que busca a menor validade de cada produto e filtra
  let vencidos = await this.histoRepository.query(`
    WITH dados_produto AS (
        SELECT 
            fkproduto,
            SUM(quant) as total_quant,
            MIN(validade) as validade_mais_antiga
        FROM historicoprod
        WHERE quant > 0
        GROUP BY fkproduto
    )
    SELECT 
        p.codigo, 
        p.nome, 
        p.categoria, 
        p.quantminimo,
        dp.validade_mais_antiga as validade, 
        dp.total_quant as quant
    FROM produto p
    JOIN dados_produto dp ON dp.fkproduto = p.codigo
    WHERE dp.validade_mais_antiga <= $1  
    ORDER BY dp.validade_mais_antiga ASC;
  `, [dataLimite]); 

  return vencidos.map(prod => {
    if (prod.validade) {
      // Converte para objeto Date (caso venha como string do banco)
      const dataObjeto = new Date(prod.validade);
      
      // Formata usando o padrão brasileiro, exibindo apenas Dia e Mês
      // O 'any' serve para aceitar a string formatada de volta no tipo do objeto
      (prod as any).validade = dataObjeto.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        timeZone: 'UTC' // Garante que o fuso horário não mude o dia para ontem ou amanhã
      });
    }
    return prod;
  });
  }

  async getProdRepo(): Promise<historicoProd[]> {
    try {
      const algo = await this.histoRepository.query(`
        select SUM(h.quant) as quant, p.nome, p.codigo from historicoProd h
        join produto p on p.codigo = h.fkproduto
        where h.quant <= p.quantminimo
        GROUP BY p.nome, p.codigo
        `)

      return algo;
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao buscar produtos com estoque baixo.`);
    }
  }


  // //Total de despesas do Mes
  //   async getProdutosEValorMonetario(): Promise<[number, number]> {
  
  //     const ValorProdutosEQuantProdutos = await this.prodRepository.query
  //     (`SELECT CAST(SUM(quant) AS DECIMAL(10,2)) AS QuantidadeProdutos, 
  //       CAST(SUM(quant * precocompra) AS DECIMAL(10,2)) AS ValorDoEstoque FROM produto`);
  
  //     return [ValorProdutosEQuantProdutos[0].quantidadeprodutos ?? 0, ValorProdutosEQuantProdutos[0].valordoestoque ?? 0];
  //   }


  //Cadastro de produtos
  async addProd(prod: Prod, HistoricoProd: historicoProd, vendedor: number): Promise<ProdutoComHistorico> {
    const queryRunner = this.dataSource.createQueryRunner();

    console.log('Produto a ser adicionado:', prod);
    console.log('Vendedor:', vendedor);

    await queryRunner.connect();
    await queryRunner.startTransaction(); //conexao aberta

    let resultado;
    try {
      // Salvar o produto
      resultado = await queryRunner.manager.save(Prod, prod);

      // Salvar o tem, relacionamento de produto com vendedor
      let resutTem = await queryRunner.manager.save(Tem, {
        valor: HistoricoProd.precocompra,
        fkproduto: prod.codigo,
        fkvendedor: vendedor,
      });

      HistoricoProd.fktem = resutTem.id;

      console.log('Historico do Produto a ser adicionado:', HistoricoProd);

      // Salvar o historico do produto
      let historicoProdut = await queryRunner.manager.save(historicoProd, HistoricoProd);


      // Salvar a despesa
      await queryRunner.manager.save(Despesas, {
        valor: HistoricoProd.precocompra * HistoricoProd.quant,
        nome: 'compra de mercadoria',
        pagou: 'sim',
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
  // async replaceVali(codigo: string): Promise<boolean> {
  //   const result = await this.prodRepository.update({ codigo: codigo }, { validade: null, quant: 0 });

  //   return result.affected !== 0;
  // }

  // async replaceProd(codigo: string, prod: Prod, HistoricoProd: historicoProd ): Promise<boolean> {
  //   const result = await this.prodRepository.update({ codigo: codigo }, prod);

  //   // const result2 = await this.histoRepository.update({ id: codigo }, prod);

  //   return result.affected !== 0;
  // }





  
  // ///////////////////////////////////////// FALTA FAZER
  // //Pesquisa modifica e deleta pelo nome
  // /////////////////////////////////////////

  // //Deletar
  // async remove(codigo: string): Promise<void> {
  //   const result = await this.prodRepository.delete(codigo); // cuidado para não apagar o bd completo
  //   if (!result) {
  //     throw new NotFoundException(`não deu para apagar o produto com codigo: ${codigo}`);
  //   }
  // }
}
