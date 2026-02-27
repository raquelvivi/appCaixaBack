
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



  async getCompras(): Promise<CompraT[]> {
    let algo = await this.comprasRepository.query(
      `SELECT p.nome AS "paciente",
        p.id, c.hora, c.data,
        m.nome AS "medico",
        h.nome AS "hospital"
        from pessoa p 
        inner join CompraT c on p.id = c.pessoa
        inner join medico m on c.medico = m.id
        inner join hospital h on c.hospital = h.id
    `)

    return algo
  }



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


  async addCompraT(compraP: string, item: ItemCompra[]): Promise<{ item: ItemCompra }> {
    console.log("Entrei no service");
    
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction(); // BEGIN, inicio da transação
      
    try{ 
    
      

      let totalV = 0;

      for (let index = 0; index < item.length; index++) {

        const element = item[index];

        totalV = totalV + (element.quantComprada * element.preco);

      }

      const compraFeita = await this.comprasRepository.query( // ID da compra feita
            `INSERT INTO compraT (total, pagamento) VALUES (${totalV}, '${compraP}') RETURNING id`)

      console.log(compraFeita[0].id);


          //Editando a tabela Produto
      for (let index = 0; index < item.length; index++) {
        
        const element = item[index];

         //console.log( `Quantidade Comprada = ${element.quantComprada}, Preco = ${element.preco}, ID Produto = ${element.id}, ID Compra = ${compraFeita.rows[0].id}`);


        let quantCompra = element.quantAntesCompra - element.quantComprada;

        if (quantCompra < 0) {
          quantCompra = 0;
        }

        console.log("Antes do update do produto");
       
        const algoP = await this.comprasRepository.query
        (`UPDATE produto SET quant = ${quantCompra} WHERE codigo = '${(element.id)}'`);

        console.log("Antes do insert na tabela itemCompra");
        
        await this.comprasRepository.query
        (`INSERT INTO itemCompra (quant, preco, fkproduto, fkcomprat) 
          VALUES (${element.quantComprada}, ${element.preco}, ${element.id}, ${compraFeita[0].id})`);
            
        }

        console.log("Utima etapa do for");

      

      
       await queryRunner.commitTransaction(); // COMMIT

       return compraFeita[0].id;

    }catch(error){
      await queryRunner.rollbackTransaction(); // ROLLBACK, desfaz as operações feitas no banco
      throw error;
    }finally {

    await queryRunner.release(); // libera conexão do pool

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
