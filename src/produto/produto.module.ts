import { Module } from '@nestjs/common';
import { ProdController } from './produto.controller';
import { ProdService } from './produto.service';
import { Prod, historicoProd, ProdutoComHistorico } from './produto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemModule } from '../tem/tem.module';
import { DespesasModule } from '../despesa/despesa.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prod,
      historicoProd
    ]),
    TemModule,
    DespesasModule
  ],
  controllers: [ProdController],
  providers: [ProdService],
  exports: [ProdService], // se outro módulo precisar usar
})
export class ProdModule {}

