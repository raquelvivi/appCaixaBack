
import { Injectable, NotFoundException } from '@nestjs/common';


import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exame } from './exame.entity';



@Injectable()
export class ExameService {

  constructor(
    @InjectRepository(Exame)
    private exameRepository: Repository<Exame>,
  ) { }

  // Exames: Exame[] = [];

  

  getExames(): Promise<Exame[]> {
    return this.exameRepository.find(); // fazer a pesquisa no repositorio
  }

  async getExame(id: number): Promise<Exame> {
     
    let algo = await this.exameRepository.findOneBy({ id });

    if (!algo){
      throw new NotFoundException(`{o id com o numero ${id} não foi achado}`)
    }
    return algo
  }

  async addExame(exame: Exame): Promise<Exame> {
    let algo = await this.exameRepository.save(exame);

    if (!algo) {
      throw new NotFoundException(`{não foi possivel cadastrar}`)
    }
    return algo
  }
  



  async replaceExame(id: number, exame: Exame): Promise < Exame > {
  const existingExame = await this.exameRepository.findOne({ where: { id } });

  if(!existingExame) {
    throw new NotFoundException(`Usuário com id ${id} não encontrado`);
  }

  // substitui os dados
    await this.exameRepository.update(id, exame);

  // busca o registro atualizado
  let algo = await this.exameRepository.findOne({ where: { id } });

  if (!algo) {
    throw new NotFoundException(`{não foi possivel achar o dado modificado}`)
  }
  return algo

}

  async remove(id: number): Promise<void> {
    const result = await this.exameRepository.delete(id);
    if (!result) {
      throw new NotFoundException(`não deu para apagar o usuario com id: ${id}`);
    }
  }


}
