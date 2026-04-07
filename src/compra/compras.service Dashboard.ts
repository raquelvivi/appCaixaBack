
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardDTO } from './dashboard.dto';

import { CompraT } from './compras.entity';

import { DespesasService } from '../despesa/despesa.service';
import { ProdService } from '../produto/produto.service';


@Injectable()
export class CompraTServiceDashboard {

  constructor(
    @InjectRepository(CompraT)
    private comprasRepository: Repository<CompraT>,
    private dataSource: DataSource, // substituto do pool

    private readonly despesasService: DespesasService,
    private readonly prodService: ProdService
  ) { }

  //Dashboard Completo
  async getDashboard(): Promise<DashboardDTO> {
    const [
      ValorCompraTotalHoje,
      ValorCompraTotalMes,
      ValorDespesasHoje,
      ValorDespesasMes,
      [QuantidadeProdutos, ValorDoEstoque],
      ArraySevenDays,
      ProdutosMaisVendidos,
      ProdutosMaisLucrativos,
      ProdutosMaisParados
    ] = await Promise.all([
      
      this.getTotalHoje(), //Valor total das Compras de Hoje
      this.getTotalMes(), //Valor total das Compras do mes
      this.despesasService.getTotalDespesasHoje(), //Valor total das despesas de Hoje
      this.despesasService.getTotalDespesasMes(), //Valor total das despesas do Mes
      this.prodService.getProdutosEValorMonetario(), //Valor total dos Produtos do estoque e a quantidade total de produtos
      this.getSevenDays(),  //Vendas dos ultimos 7 dias
      this.getProdutosMaisVendidos(),  // Produtos mais vendidos no mes
      this.getProdutosMaisLucrativos(),  // Produtos mais Lucrativos no mes
      this.getProdutosMaisParados()  // Produtos mais Parados no mes, sem vendas, ou com poucas vendas
    ]);
    return {
      Financeiro: {
        soma_total_hoje: ValorCompraTotalHoje, 
        soma_total_mes: ValorCompraTotalMes,
        despesas_hoje: ValorDespesasHoje,
        despesas_mes: ValorDespesasMes,
        Lucro_mes: ValorCompraTotalMes - ValorDespesasMes, // Lucro do mês
      },
      Estoque:{
        Quantidade_produtos_No_Estoque: QuantidadeProdutos,
        Valor_Retido_no_Estoque: ValorDoEstoque,
      },
      Arrays:{
        Vendas_ultimos_7_dias: ArraySevenDays,
        Mais_Vendidos_mes: ProdutosMaisVendidos,
        Mais_Lucrativos_mes: ProdutosMaisLucrativos,
        Mais_Parados_mes: ProdutosMaisParados
      }
    };
  }


  //Total por Mes
  async getTotalMes(): Promise<number> {

    const ValorCompraTotalMes = await this.comprasRepository.query
    (`SELECT CAST(SUM(total) AS DECIMAL(10,2)) AS soma_total FROM compraT
      WHERE DATE_TRUNC('month', data) = DATE_TRUNC('month', CURRENT_DATE);`);

    if (!ValorCompraTotalMes || ValorCompraTotalMes.length === 0) {
    return 0;
  }
    return ValorCompraTotalMes[0].soma_total ?? 0;
  }



 //Total por Hoje
  async getTotalHoje(): Promise<number> {

    const getTotalHoje = await this.comprasRepository.query
    (`SELECT CAST(SUM(total) AS DECIMAL(10,2)) AS soma_total FROM compraT
      WHERE DATE(data) = CURRENT_DATE;`);

    if (!getTotalHoje || getTotalHoje.length === 0) {
      return 0;
   }
    return getTotalHoje[0].soma_total ?? 0
  }


  //Vendas dos ultimos 7 dias
  async getSevenDays(): Promise<[]> {

    const UltimosSevenDays = await this.comprasRepository.query
    (`SELECT 
        d::date AS dia,
        COALESCE(SUM(c.total), 0) AS total
      FROM generate_series(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      ) d
      LEFT JOIN CompraT c ON DATE(c.data) = d
      GROUP BY d
      ORDER BY d;`);

    if (!UltimosSevenDays || UltimosSevenDays.length === 0) {
    return [];
  }
    return UltimosSevenDays ?? 0;
  }


   //Produtos mais vendidos no mes
   async getProdutosMaisVendidos(): Promise<[]> {

    const MaisVendidos = await this.comprasRepository.query
    (`SELECT p.nome, SUM(i.quant) AS total_vendido, (i.preco * SUM(i.quant)) AS "ValorTotalVendido"
      FROM ItemCompra i
      JOIN Produto p ON p.codigo = i.fkProduto
      JOIN CompraT c ON c.id = i.fkCompraT
      WHERE DATE_TRUNC('month', c.data) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY p.nome, i.preco
      ORDER BY total_vendido DESC
      LIMIT 5;`);

    if (!MaisVendidos || MaisVendidos.length === 0) {
    return [];
  }
    return MaisVendidos ?? 0;
  }


  //Produtos mais Lucrativos do mes
   async getProdutosMaisLucrativos(): Promise<[]> {

    const MaisLucrativos = await this.comprasRepository.query
    (`SELECT p.nome, CAST(SUM(i.quant) AS DECIMAL(10,2)) AS total_vendido, 
      CAST((i.preco * SUM(i.quant)) AS DECIMAL(10,2)) AS valor_total_vendido
      FROM ItemCompra i
      JOIN Produto p ON p.codigo = i.fkProduto
      JOIN CompraT c ON c.id = i.fkCompraT
      WHERE DATE_TRUNC('month', c.data) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY p.nome, i.preco
      ORDER BY valor_total_vendido DESC
      LIMIT 5;
      `);

    if (!MaisLucrativos || MaisLucrativos.length === 0) {
    return [];
  }
    return MaisLucrativos ?? 0;
  }

  //Produtos mais Parado do mes
   async getProdutosMaisParados(): Promise<[]> {

    const MaisParados = await this.comprasRepository.query
    (`SELECT 
      p.codigo,
      p.nome,
      p.quant,
      COALESCE(SUM(i.quant), 0) AS total_vendido
      FROM Produto p
      LEFT JOIN ItemCompra i ON i.fkProduto = p.codigo
      LEFT JOIN CompraT c ON c.id = i.fkCompraT
        AND c.data >= CURRENT_DATE - INTERVAL '30 days'
      WHERE p.quant > 0
      GROUP BY p.codigo, p.nome, p.quant
      ORDER BY total_vendido ASC 
      LIMIT 10;
      `);

    if (!MaisParados || MaisParados.length === 0) {
    return [];
  }
    return MaisParados ?? 0;
  }


}
