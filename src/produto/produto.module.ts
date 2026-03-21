import { Module } from '@nestjs/common';
import { ProdController } from './produto.controller';
import { ProdService } from './produto.service';
import { Prod } from './produto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemModule } from '../tem/tem.module';
import { AquisicaoModule } from '../aquisicao/aquisicao.module';
import { DespesasModule } from '../despesa/despesa.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prod]),
    TemModule,
    AquisicaoModule,
    DespesasModule
  ],
  controllers: [ProdController],
  providers: [ProdService],
  exports: [ProdService], // se outro módulo precisar usar
})
export class ProdModule {}
