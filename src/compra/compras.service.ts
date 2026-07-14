
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompraT, ItemCompra } from './compras.entity';

import { DespesasService } from '../despesa/despesa.service';
import { ProdService } from '../produto/produto.service';


@Injectable()
export class CompraTService {

  constructor(
    @InjectRepository(CompraT)
    private comprasRepository: Repository<CompraT>,
    private dataSource: DataSource, // substituto do pool

    private readonly despesasService: DespesasService,
    private readonly prodService: ProdService
  ) { }


  async getTotalVendas (dataInicio: Date, dataFim: Date): Promise<number> {
    const resultado = await this.comprasRepository.query
    (`SELECT SUM(total) AS soma_total
      FROM compraT
      WHERE "data" >= $1
      AND "data" <  $2`, [
      [dataInicio], [dataFim]
    ]);

    if (!resultado || resultado.length === 0) {
    return 0;
  }
    return resultado[0].soma_total ?? 0;
  }

  async getVendas (): Promise<CompraT[]> {
    const resultado = await this.comprasRepository.query
    (`SELECT * FROM compraT limit 10`);

    if (!resultado || resultado.length === 0) {
    return [];
  }
    return resultado;
  }

  async getCompraT(id: number): Promise<CompraT> {
    let algo = await this.comprasRepository.findOneBy({ id });
    if (!algo) {
      throw new NotFoundException(`{o id com o numero ${id} não foi achado}`)
    }
    return algo
  }

//  Cadastro de Compras
  async addCompraT(compraP: string, item: ItemCompra[]): Promise<{ item: ItemCompra }> {
    
    const queryRunner = this.dataSource.createQueryRunner(); 

    await queryRunner.connect(); // conecta ao banco

    await queryRunner.startTransaction(); // BEGIN, inicio da transação
    try{ 

      let totalV = 0;
      //calculo do valor total da compra
      for (let index = 0; index < item.length; index++) {
        const element = item[index];
        totalV = totalV + (element.quantComprada * element.preco);
      }

      totalV = parseFloat(totalV.toFixed(2)); // arredonda para 2 casas decimais
      const insertCompraSql = `INSERT INTO compraT (total, pagamento) VALUES ($1, $2) RETURNING id`;
      const compraFeita = await queryRunner.manager.query(insertCompraSql, [totalV, String(compraP || 'Dinheiro')]); // insere a compra e retorna o ID da compra feita

          //para cada item comprado, atualiza a quantidade do produto e insere o itemCompra
      for (let index = 0; index < item.length; index++) {

        const element = item[index];
        console.log('element', element);
        const quantCompradaProdutosItemCompra = element.quantComprada;
        var quantCompra = 1, totalVoltas = 5;

        while (quantCompra != 0 && totalVoltas > 0) {

          const getHistorico= `select id, quant from historicoprod where fkproduto = $1 and quant > 0 ORDER by validade asc LIMIT 1`;
          const getIDHistoricoProduto = await queryRunner.manager.query(getHistorico, [String(element.id)]);

          quantCompra = getIDHistoricoProduto[0].quant - element.quantComprada;
          if (quantCompra < 0) { // para não ter produtos com quantidade negativa

            const updatehistorico = `UPDATE historicoprod SET quant = 0 WHERE id = $1`;
            await queryRunner.manager.query(updatehistorico, [String(getIDHistoricoProduto[0].id)]);

            element.quantComprada = element.quantComprada - getIDHistoricoProduto[0].quant; // atualiza a quantidade do item comprado para o próximo loop

            totalVoltas = totalVoltas - 1; // para não entrar em loop infinito caso não tenha produtos suficientes no estoque
          }else {
            quantCompra = parseFloat(quantCompra.toFixed(3)); // arredonda para 2 casas decimais
          
            const updatehistorico = `UPDATE historicoprod SET quant = $1 WHERE id = $2`;
            await queryRunner.manager.query(updatehistorico, [quantCompra, String(getIDHistoricoProduto[0].id)]);

            quantCompra = 0
          }

        

      }

      const getHistorico= `select id from historicoprod where fkproduto = $1 and quant > 0 ORDER by criado_em desc limit 1`;
      const getIDHistoricoProduto = await queryRunner.manager.query(getHistorico, [String(element.id)]);

      const insertItemCompra = `INSERT INTO itemCompra (quant, preco, fkhistoricop, fkcomprat) VALUES ($1, $2, $3, $4)`;
      await queryRunner.manager.query(insertItemCompra, [
        quantCompradaProdutosItemCompra,
        element.preco,
        getIDHistoricoProduto[0].id,
        compraFeita[0].id
      ]);  
        }
       await queryRunner.commitTransaction(); // COMMIT
       return compraFeita[0].id; // retorna o ID da compra feita para o front
    }catch(error){
      await queryRunner.rollbackTransaction(); // ROLLBACK, desfaz as operações feitas no banco
      throw error;
    }finally {

    await queryRunner.release(); // libera conexão do pool para não travar o banco

  }
  }




//   async replaceCompraT(id: number, compra: CompraT): Promise<CompraT> {
//     const existingCompraT = await this.comprasRepository.findOne({ where: { id } });

//     if (!existingCompraT) {
//       throw new NotFoundException(`Usuário com id ${id} não encontrado`);
//     }

//     // substitui os dados
//     await this.comprasRepository.update(id, compra);

//     // busca o registro atualizado
//     let algo = await this.comprasRepository.findOne({ where: { id } });

//     if (!algo) {
//       throw new NotFoundException(`{não foi possivel achar o dado modificado}`)
//     }
//     return algo
//   }


//   async remove(id: number): Promise<void> {
//     const result = await this.comprasRepository.delete(id);
//     if (!result) {
//       throw new NotFoundException(`não deu para apagar o usuario com id: ${id}`);
//     }
//   }


}
