
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

  @Get('validade/')
  getProdValidade(): Promise<Prod[]> {
    return this.ProdService.getProdValidade();
  }

  @Get('repo/')
  getProdRepo(): Promise<Prod[]> {
    return this.ProdService.getProdRepo();
  }

  //Pesquisa de produtos com o nome

  @Get('label/:codigo')
  getProdNome(@Param('codigo') codigo: string): Promise<Prod> {
    return this.ProdService.getProdNome(codigo);
  }

  //Pesquisa de produtos com o codigo de barras

  @Get(':codigo')
  getProd(@Param('codigo') codigo: string): Promise<Prod> {
    return this.ProdService.getProd(codigo);
  }

  //Cadastro de produtos
  @Post()
  addProd(@Body() Prod: Prod, @Body('vendedor') vendedor: number): Promise<Prod> {
    return this.ProdService.addProd(Prod, vendedor);
  }

  //Editar validade do produto
  @Put(':codigo')
  replaceVali(@Param('codigo') codigo: string): Promise<boolean> {
    return this.ProdService.replaceVali(codigo);
  }


    ///////////////////////////////////////// FALTA FAZER
    //Pesquisa modifica e deleta pelo nome
    /////////////////////////////////////////

  //Deletar
  @Delete(':codigo')
  removeProd(@Param('codigo') codigo: string): Promise<void> {
    return this.ProdService.remove(codigo);
  }
}
