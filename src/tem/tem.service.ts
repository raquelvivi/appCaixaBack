//Importando pacotes

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThanOrEqual, LessThan } from 'typeorm';

//Importando pacotes Locais feitos a mão
import { Tem } from './tem.entity';

@Injectable()
export class TemService {
  constructor(
    @InjectRepository(Tem)
    private temRepository: Repository<Tem>,
    private dataSource: DataSource,
  ) {}

  //Pesquisa de todos os produtos
  getTem(): Promise<Tem[]> {
    return this.temRepository.find();
  }

  //fazer put e delete

}
