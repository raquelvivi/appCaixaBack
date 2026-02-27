import { Module } from '@nestjs/common';
import { ProdModule } from './produto/produto.module';
import { VendedorModule } from './vendedor/vendedor.module';
import { CompraTModule } from './compra/compras.module';
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
  ],
})
export class AppModule { }
