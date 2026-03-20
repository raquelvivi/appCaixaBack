import { Module } from '@nestjs/common';
import { AquisicaoController } from './aquisicao.controller';
import { AquisicaoService } from './aquisicao.service';
import { Aquisicao } from './aquisicao.entity';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  imports: [TypeOrmModule.forFeature([Aquisicao])],
  controllers: [AquisicaoController],
  providers: [AquisicaoService],
  exports: [AquisicaoService], // se outro módulo precisar usar
})
export class AquisicaoModule {}
