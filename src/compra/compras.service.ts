
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompraT, ItemCompra } from './compras.entity';





// export type CompraT = {
//   id: number;
//   name: string;
//   age: number;
//   uf: string;
// }


@Injectable()
export class CompraTService {

  constructor(
    @InjectRepository(CompraT)
    private comprasRepository: Repository<CompraT>,
    private dataSource: DataSource // substituto do pool
  ) { }

  // CompraTs: CompraT[] = [];



  // async getCompras(): Promise<CompraT[]> {
  //   let algo = await this.comprasRepository.query(
  //     `SELECT p.nome AS "paciente",
  //       p.id, c.hora, c.data,
  //       m.nome AS "medico",
  //       h.nome AS "hospital"
  //       from pessoa p 
  //       inner join CompraT c on p.id = c.pessoa
  //       inner join medico m on c.medico = m.id
  //       inner join hospital h on c.hospital = h.id
  //   `)

  //   return algo
  // }



  async getCompraT(id: number): Promise<CompraT> {

    let algo = await this.comprasRepository.findOneBy({ id });

    if (!algo) {
      throw new NotFoundException(`{o id com o numero ${id} não foi achado}`)
    }
    return algo
  }

  // async getCompraT(id: number) {

  //   let algo = await this.comprasRepository.query(
  //     `SELECT p.nome AS "paciente",
  //       p.id, c.hora, c.data,
  //       m.nome AS "medico",
  //       h.nome AS "hospital"
  //       from pessoa p 
  //       inner join CompraT c on p.id = c.pessoa
  //       inner join medico m on c.medico = m.id
  //       inner join hospital h on c.hospital = h.id
  //       WHERE p.id = $1
  //   `, [id])

  //   if (!algo) {
  //     throw new NotFoundException(`{o id com o numero ${id} não foi achado}`)
  //   }
  //   return algo
  // }


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
      const compraFeita = await queryRunner.manager.query(insertCompraSql, [totalV, String(compraP)]);

          //para cada item comprado, atualiza a quantidade do produto e insere o itemCompra
      for (let index = 0; index < item.length; index++) {
        
        const element = item[index];


        let quantCompra = element.quantAntesCompra - element.quantComprada;

        if (quantCompra < 0) { // para não ter produtos com quantidade negativa
          quantCompra = 0;
        }

        quantCompra = parseFloat(quantCompra.toFixed(3)); // arredonda para 2 casas decimais
       
        const updatePruduto = `UPDATE produto SET quant = $1 WHERE codigo = $2`;
        await queryRunner.manager.query(updatePruduto, [quantCompra, String(element.id)]);

      const insertItemCompra = `INSERT INTO itemCompra (quant, preco, fkproduto, fkcomprat) VALUES ($1, $2, $3, $4)`;
      await queryRunner.manager.query(insertItemCompra, [
        element.quantComprada,
        element.preco,
        element.id,
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




  async replaceCompraT(id: number, compra: CompraT): Promise<CompraT> {
    const existingCompraT = await this.comprasRepository.findOne({ where: { id } });

    if (!existingCompraT) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }

    // substitui os dados
    await this.comprasRepository.update(id, compra);

    // busca o registro atualizado
    let algo = await this.comprasRepository.findOne({ where: { id } });

    if (!algo) {
      throw new NotFoundException(`{não foi possivel achar o dado modificado}`)
    }
    return algo
  }


  async remove(id: number): Promise<void> {
    const result = await this.comprasRepository.delete(id);
    if (!result) {
      throw new NotFoundException(`não deu para apagar o usuario com id: ${id}`);
    }
  }


}
