import { Module } from '@nestjs/common';
import { ProdModule } from './produto/produto.module';
import { VendedorModule } from './vendedor/vendedor.module';
import { CompraTModule } from './compra/compras.module';
import { DespesasModule } from './despesa/despesa.module';
// import { DespesasModule } from './despesa/despesa.module';
import { TemModule } from './tem/tem.module';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,

      ssl: { rejectUnauthorized: false },
      
      autoLoadEntities: true,
      synchronize: false, // não edita meu banco
    }),
    ProdModule,
    VendedorModule,
    CompraTModule,
    DespesasModule,
    TemModule,
  ],
})
export class AppModule { }
