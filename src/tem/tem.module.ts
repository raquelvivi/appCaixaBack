import { Module } from '@nestjs/common';
import { TemController } from './tem.controller';
import { TemService } from './tem.service';
import { Tem } from './tem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  imports: [TypeOrmModule.forFeature([Tem])],
  controllers: [TemController],
  providers: [TemService],
  exports: [TemService], // se outro módulo precisar usar
})
export class TemModule {}
