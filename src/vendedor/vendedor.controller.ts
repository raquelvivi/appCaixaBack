
import { Controller, Get, Post, Patch, Put, Delete, Body, Param } from '@nestjs/common';
import { VendedorService } from './vendedor.service';
import { Vendedor } from './vendedor.entity';

@Controller('venderd') //dentro dos parenteses coloque o nome da rota ex: 'teste' e então tera de pesquisar http://localhost:3000/teste
export class VendedorController {
    constructor(private readonly vendedorService: VendedorService) {}


  @Get()
  getVendedors(): Promise<Vendedor[]> {
    return this.vendedorService.getVendedors();
  }


  // @Get(':id')
  // getVendedor(@Param('id') id: number): Promise<Vendedor> {
    
  //   return this.vendedorService.getVendedor(id);
  // }


  @Post()
  addVendedor(@Body() vendedor: Vendedor): Promise<Vendedor> {
    return this.vendedorService.addVendedor(vendedor);
  }



  // @Put(":id")
  // replaceVendedor(@Param("id") id: number, @Body() newData: Vendedor): Promise<Vendedor> {
  //   return this.vendedorService.replaceVendedor(id, newData);
  // }


  // @Delete(':id')
  // removeVendedor(@Param('id') id: number): Promise<void> {
  //   return this.vendedorService.remove(id);
  // }


}

