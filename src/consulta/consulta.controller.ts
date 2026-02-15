
import { Controller, Get, Post, Patch, Put, Delete, Body, Param } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { Consulta } from './consulta.entity';

@Controller('consultas') //dentro dos parenteses coloque o nome da rota ex: 'teste' e então tera de pesquisar http://localhost:3000/teste
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) { }


  @Get()
  getConsultas(): Promise<Consulta[]> {
    return this.consultaService.getConsultas();
  }


  @Get(':id')
  getConsulta(@Param('id') id: number): Promise<Consulta> {

    return this.consultaService.getConsulta(id);
  }

  @Get('pessoa/:id')
  getConsultaPessoa(@Param('id') id: number) {

    return this.consultaService.getConsultaPessoa(id);
  }

  @Post()
  addConsulta(@Body() consulta: Consulta): Promise<Consulta> {
    return this.consultaService.addConsulta(consulta);
  }



  @Put(":id")
  replaceConsulta(@Param("id") id: number, @Body() newData: Consulta): Promise<Consulta> {
    return this.consultaService.replaceConsulta(id, newData);
  }


  @Delete(':id')
  removeConsulta(@Param('id') id: number): Promise<void> {
    return this.consultaService.remove(id);
  }


}

