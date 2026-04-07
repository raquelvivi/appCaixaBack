import { Module } from '@nestjs/common';
import { ProdModule } from './produto/produto.module';
import { VendedorModule } from './vendedor/vendedor.module';
import { CompraTModule } from './compra/compras.module';
import { AquisicaoModule } from './aquisicao/aquisicao.module';
import { DespesasModule } from './despesa/despesa.module';
// import { DespesasModule } from './despesa/despesa.module';
import { TemModule } from './tem/tem.module';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Itabor1i',
      database: 'vitorK',
      autoLoadEntities: true,
      synchronize: false, // não edita meu banco
    }),
    ProdModule,
    VendedorModule,
    CompraTModule,
    AquisicaoModule,
    DespesasModule,
    TemModule,
  ],
})
export class AppModule { }
