
import { Controller, Get, Post, Patch, Put, Delete, Body, Param } from '@nestjs/common';
import { ExameService } from './exame.service';
import { Exame } from './exame.entity';

@Controller('exames') //dentro dos parenteses coloque o nome da rota ex: 'teste' e então tera de pesquisar http://localhost:3000/teste
export class ExameController {
    constructor(private readonly exameService: ExameService) {}


  @Get()
  getExames(): Promise<Exame[]> {
    return this.exameService.getExames();
  }


  @Get(':id')
  getExame(@Param('id') id: number): Promise<Exame> {
    
    return this.exameService.getExame(id);
  }


  @Post()
  addExame(@Body() exame: Exame): Promise<Exame> {
    return this.exameService.addExame(exame);
  }



  @Put(":id")
  replaceExame(@Param("id") id: number, @Body() newData: Exame): Promise<Exame> {
    return this.exameService.replaceExame(id, newData);
  }


  @Delete(':id')
  removeExame(@Param('id') id: number): Promise<void> {
    return this.exameService.remove(id);
  }


}

