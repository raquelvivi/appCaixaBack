import { Module } from '@nestjs/common';
import { ExameController } from './exame.controller';
import { ExameService } from './exame.service';
import { Exame } from './exame.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Exame])],
  controllers: [ExameController],
  providers: [ExameService],
  exports: [ExameService], // se outro módulo precisar usar
})
export class ExameModule {}
