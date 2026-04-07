import { Module } from '@nestjs/common';
import { CompraTController } from './compras.controller';
import { CompraTService } from './compras.service';
import { CompraTServiceDashboard } from './compras.service Dashboard';
import { CompraT } from './compras.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DespesasModule } from '../despesa/despesa.module';
import { ProdModule } from '../produto/produto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompraT]),
    DespesasModule,
    ProdModule
  
  ],
  controllers: [CompraTController],
  providers: [CompraTService, CompraTServiceDashboard],
  exports: [CompraTService, CompraTServiceDashboard], // se outro módulo precisar usar
})
export class CompraTModule { }
