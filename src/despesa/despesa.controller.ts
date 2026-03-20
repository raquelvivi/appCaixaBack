
//Importando pacotes
import { Controller, Get, Post, Patch, Put, Delete, Body, Param } from '@nestjs/common'; 

//Importando pacotes Locais feitos a mão
import { DespesasService } from './despesa.service';
import { Despesas } from './despesa.entity';

@Controller('despesas') //dentro dos parenteses coloque o nome da rota ex: 'teste' e então tera de pesquisar http://localhost:3000/teste
export class DespesasController {
  constructor(private readonly DespesasService: DespesasService) {}

  //Pesquisa de todos os Despesas
  @Get()
  getDespesass(): Promise<Despesas[]> {
    return this.DespesasService.getDespesas();
  }

  //Cadastro de Despesas
  @Post()
  addDespesas(@Body() classDespesas: Despesas): Promise<Despesas> {
    return this.DespesasService.addDespesas(classDespesas);
  }

    ///////////////////////////////////////// FALTA FAZER
    //Pesquisa modifica e deleta pelo nome
    /////////////////////////////////////////

  //Deletar
  @Delete(':codigo')
  removeDespesas(@Param('codigo') codigo: string): Promise<void> {
    return this.DespesasService.remove(codigo);
  }
}
