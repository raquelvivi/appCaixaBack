import { Module } from '@nestjs/common';
import { ProdModule } from './produto/produto.module';
// import { ExameModule } from './exame/exame.module';
// import { ConsultaModule } from './consulta/consulta.module';
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
      synchronize: false, // para que essa bosta serve????????????
    }),
    ProdModule,
    // ExameModule,
    // ConsultaModule,
  ],
})
export class AppModule { }
