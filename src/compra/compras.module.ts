import { Module } from '@nestjs/common';
import { CompraTController } from './compras.controller';
import { CompraTService } from './compras.service';
import { CompraT } from './compras.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CompraT])],
  controllers: [CompraTController],
  providers: [CompraTService],
  exports: [CompraTService], // se outro módulo precisar usar
})
export class CompraTModule { }
