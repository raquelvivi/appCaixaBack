//Importando pacotes

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThanOrEqual, LessThan } from 'typeorm';

//Importando pacotes Locais feitos a mão
import { Tem } from './tem.entity';

@Injectable()
export class TemService {
  constructor(
    @InjectRepository(Tem)
    private temRepository: Repository<Tem>,
    private dataSource: DataSource,
  ) {}

  //Pesquisa de todos os produtos
  getTem(): Promise<Tem[]> {
    return this.temRepository.find();
  }



  async getTemRelacao(codigo: string): Promise<Tem[]> {
      const resultado = await this.temRepository.query(`  
        SELECT p.nome, p.codigo, 
        tem.valor AS "Preco",
        v.nome AS "vendedor",
        tem.id AS "id-Vendedor"
        FROM produto p
        INNER JOIN tem ON tem.fkproduto = p.codigo
        INNER JOIN vendedor v ON v.id = tem.fkvendedor
        WHERE p.codigo = $1;`, 
        [codigo]);
      return resultado;
    }
}
