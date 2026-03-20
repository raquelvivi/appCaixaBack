import { Module } from '@nestjs/common';
import { DespesasController } from './despesa.controller';
import { DespesasService } from './despesa.service';
import { Despesas } from './despesa.entity';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  imports: [TypeOrmModule.forFeature([Despesas])],
  controllers: [DespesasController],
  providers: [DespesasService],
  exports: [DespesasService], // se outro módulo precisar usar
})
export class DespesasModule {}
