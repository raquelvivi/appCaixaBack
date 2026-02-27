
import { Controller, Get, Post, Patch, Put, Delete, Body, Param } from '@nestjs/common';
import { CompraTService } from './compras.service';
import { CompraT, ItemCompra } from './compras.entity';

@Controller('compras') //dentro dos parenteses coloque o nome da rota ex: 'teste' e então tera de pesquisar http://localhost:3000/teste
export class CompraTController {
  constructor(private readonly compraService: CompraTService) { }


  @Get()
  getCompras(): Promise<CompraT[]> {
    return this.compraService.getCompras();
  }


  @Get(':id')
  getCompraT(@Param('id') id: number): Promise<CompraT> {

    return this.compraService.getCompraT(id);
  }

  // @Get('pessoa/:id')
  // getCompraTPessoa(@Param('id') id: number) {

  //   return this.compraService.getCompraT(id);
  // }

  @Post()
    addCompraT(@Body('compra') compra: string, @Body('item') item: ItemCompra[]): Promise<{ item: ItemCompra }> {
      console.log(compra);
      console.log(item);
    return this.compraService.addCompraT(compra, item);
  }



  @Put(":id")
  replaceCompraT(@Param("id") id: number, @Body() newData: CompraT): Promise<CompraT> {
    return this.compraService.replaceCompraT(id, newData);
  }


  @Delete(':id')
  removeCompraT(@Param('id') id: number): Promise<void> {
    return this.compraService.remove(id);
  }


}

