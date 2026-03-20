
//Importando pacotes
import { Controller, Get, Post, Patch, Put, Delete, Body, Param } from '@nestjs/common'; 

//Importando pacotes Locais feitos a mão
import { TemService } from './tem.service';
import { Tem } from './tem.entity';

@Controller('tem') //dentro dos parenteses coloque o nome da rota ex: 'teste' e então tera de pesquisar http://localhost:3000/teste
export class TemController {
  constructor(private readonly TemService: TemService) {}

  //Pesquisa de todos os produtos
  @Get()
  getTem(): Promise<Tem[]> {
    return this.TemService.getTem();
  }

  //fazer put e delete
}
