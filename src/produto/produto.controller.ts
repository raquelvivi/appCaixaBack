
//Importando pacotes
import { Controller, Get, Post, Patch, Put, Delete, Body, Param } from '@nestjs/common'; 

//Importando pacotes Locais feitos a mão
import { ProdService } from './produto.service';
import { Prod } from './produto.entity';

@Controller('prods') //dentro dos parenteses coloque o nome da rota ex: 'teste' e então tera de pesquisar http://localhost:3000/teste
export class ProdController {
  constructor(private readonly ProdService: ProdService) {}

  //Pesquisa de todos os produtos
  @Get()
  getProds(): Promise<Prod[]> {
    return this.ProdService.getProds();
  }

  //Pesquisa de produtos com o codigo de barras

  @Get(':codigo')
  getProd(@Param('codigo') codigo: string): Promise<Prod> {
    return this.ProdService.getProd(codigo);
  }

  ///////////////////////////////////////// FALTA FAZER
  //Pesquisa de produtos com o nome
  /////////////////////////////////////////

  //Cadastro de produtos
  @Post()
  addProd(@Body() Prod: Prod): Promise<Prod> {
    return this.ProdService.addProd(Prod);
  }

  ///////////////////////////////////////// FALTA FAZER
  //Pesquisa modifica e deleta pelo nome
  /////////////////////////////////////////

  //Editar a base do codigo de barras
  @Put(':codigo')
  replaceProd(@Param('codigo') codigo: string, @Body() newData: Prod): Promise<Prod> {
    return this.ProdService.replaceProd(codigo, newData);
  }

  //Deletar
  @Delete(':codigo')
  removeProd(@Param('codigo') codigo: string): Promise<void> {
    return this.ProdService.remove(codigo);
  }
}

