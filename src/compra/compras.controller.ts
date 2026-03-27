
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CompraTService } from './compras.service';
import { CompraT, ItemCompra } from './compras.entity';

@Controller('compras') //dentro dos parenteses coloque o nome da rota ex: 'teste' e então tera de pesquisar http://localhost:3000/teste
export class CompraTController {
  constructor(private readonly compraService: CompraTService) { }


  @Get()
  getTotalVendas(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string
  ): Promise<number> {
    return this.compraService.getTotalVendas(new Date(dataInicio), new Date(dataFim));
  }

  @Post()
    addCompraT(@Body('compra') compra: string, @Body('item') item: ItemCompra[]): Promise<{ item: ItemCompra }> {
    return this.compraService.addCompraT(compra, item);
  }


}

