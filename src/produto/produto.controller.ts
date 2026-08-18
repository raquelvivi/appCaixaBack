
//Importando pacotes
import { Controller, Get, Post, Patch, Put, Delete, Body, Param } from '@nestjs/common'; 

//Importando pacotes Locais feitos a mão
import { ProdService } from './produto.service';
import { Prod, historicoProd, ProdutoComHistorico  } from './produto.entity';

@Controller('prods') //dentro dos parenteses coloque o nome da rota ex: 'teste' e então tera de pesquisar http://localhost:3000/teste
export class ProdController {
  constructor(private readonly ProdService: ProdService) {}

  //Pesquisa de todos os produtos
  @Get()
  getProds(): Promise<ProdutoComHistorico[]> {
    return this.ProdService.getProds();
  }

  @Get('validade/')
  getProdValidade(): Promise<historicoProd[]> {
    return this.ProdService.getProdValidade();
  }

  @Get('repo/')
  getProdRepo(): Promise<historicoProd[]> {
    return this.ProdService.getProdRepo();
  }

  // //Pesquisa de produtos e vendedores com o nome

  @Get('label/:codigo')
  getProdNome(@Param('codigo') codigo: string): Promise<Prod> {
    return this.ProdService.getProdNome(codigo);
  }

  // // @Get('label/:codigo')
  // // getProdCodigoVendedor(@Param('codigo') codigo: string): Promise<Prod> {
  // //   return this.ProdService.getProdCodigoVendedor(codigo);
  // // }

  

  // //Pesquisa de produtos com o codigo de barras

  @Get(':codigo')
  getProd(@Param('codigo') codigo: string): Promise<Prod> {
    return this.ProdService.getProd(codigo);
  }

  //Cadastro de produtos
  @Post()
  addProd(@Body() Prod: Prod, @Body() HistoricoProd: historicoProd, @Body('vendedor') vendedor: number): Promise<ProdutoComHistorico> {
    return this.ProdService.addProd(Prod, HistoricoProd, vendedor);
  }

  //Editar validade do produto
  @Put(':codigo')
  replaceVali(@Param('codigo') codigo: number): Promise<boolean> {
    return this.ProdService.replaceVali(codigo);
  }

  //  //Editar produto
  // @Put('product/:codigo')
  // replaceProd(@Param('codigo') codigo: string,@Body() Prod: Prod): Promise<boolean> {
  //   return this.ProdService.replaceProd(codigo, Prod);
  // }


  //   ///////////////////////////////////////// FALTA FAZER
  //   //Pesquisa modifica e deleta pelo nome
  //   /////////////////////////////////////////

  // //Deletar
  // @Delete(':codigo')
  // removeProd(@Param('codigo') codigo: string): Promise<void> {
  //   return this.ProdService.remove(codigo);
  // }
}
