import { Module } from '@nestjs/common';
import { ProdController } from './produto.controller';
import { ProdService } from './produto.service';
import { Prod } from './produto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Prod])],
  controllers: [ProdController],
  providers: [ProdService],
  exports: [ProdService], // se outro módulo precisar usar
})
export class ProdModule {}
