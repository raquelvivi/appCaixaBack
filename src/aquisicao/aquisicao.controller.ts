
//Importando pacotes
import { Controller, Get, Post, Patch, Put, Delete, Body, Param } from '@nestjs/common'; 

//Importando pacotes Locais feitos a mão
import { AquisicaoService } from './aquisicao.service';
import { Aquisicao } from './aquisicao.entity';

@Controller('aquisicao') //dentro dos parenteses coloque o nome da rota ex: 'teste' e então tera de pesquisar http://localhost:3000/teste
export class AquisicaoController {
  constructor(private readonly AquisicaoService: AquisicaoService) {}

  //Pesquisa de todos os Aquisicao
  @Get()
  getAquisicao(): Promise<Aquisicao[]> {
    return this.AquisicaoService.getAquisicao();
  }

  //Cadastro de Aquisicao
  @Post()
  addAquisicao(@Body() ClassAquisicao: Aquisicao): Promise<Aquisicao> {
    return this.AquisicaoService.addAquisicao(ClassAquisicao);
  }

    ///////////////////////////////////////// FALTA FAZER
    //Pesquisa modifica e deleta pelo nome
    /////////////////////////////////////////

  //Deletar
  @Delete(':codigo')
  removeClassAquisicao(@Param('codigo') codigo: string): Promise<void> {
    return this.AquisicaoService.remove(codigo);
  }
}
