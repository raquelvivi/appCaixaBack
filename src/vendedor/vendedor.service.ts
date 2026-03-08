
import { Injectable, NotFoundException } from '@nestjs/common';


import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendedor } from './vendedor.entity';



@Injectable()
export class VendedorService {

  constructor(
    @InjectRepository(Vendedor)
    private vendedorRepository: Repository<Vendedor>,
  ) { }

  // Vendedors: Vendedor[] = [];

  getVendedors(): Promise<Vendedor[]> {
    return this.vendedorRepository.find(); 
  }

  async getVendedor(id: number): Promise<Vendedor> {
     
    let algo = await this.vendedorRepository.findOneBy({ id });

    if (!algo){
      throw new NotFoundException(`{o id com o numero ${id} não foi achado}`)
    }
    return algo
  }

  async addVendedor(vendedor: Vendedor): Promise<Vendedor> {

    let algo = await this.vendedorRepository.query
    (`INSERT INTO vendedor (nome, cnpj, contato, vindames) VALUES ($1, $2, $3, $4)`, 
    [vendedor.nome, vendedor.cnpj, vendedor.contato, vendedor.vindames]);

    if (!algo) {
      throw new NotFoundException(`{não foi possivel cadastrar}`)
    }
    return algo
  }
  



//   async replaceVendedor(id: number, vendedor: Vendedor): Promise < Vendedor > {
//   const existingVendedor = await this.vendedorRepository.findOne({ where: { id } });

//   if(!existingVendedor) {
//     throw new NotFoundException(`Usuário com id ${id} não encontrado`);
//   }

//   // substitui os dados
//     await this.vendedorRepository.update(id, vendedor);

//   // busca o registro atualizado
//   let algo = await this.vendedorRepository.findOne({ where: { id } });

//   if (!algo) {
//     throw new NotFoundException(`{não foi possivel achar o dado modificado}`)
//   }
//   return algo

// }

//   async remove(id: number): Promise<void> {
//     const result = await this.vendedorRepository.delete(id);
//     if (!result) {
//       throw new NotFoundException(`não deu para apagar o usuario com id: ${id}`);
//     }
//   }


}
