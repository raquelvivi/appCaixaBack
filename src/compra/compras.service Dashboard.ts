
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
      ProdutosMaisParados,
      ValorCompraTotalMesPorCategoria,
      ProdutosSemEstoque,
      TotalVendedores,
      ultimaCompra
    ] = await Promise.all([
      
      this.getTotalHoje(), //Valor total das Compras de Hoje
      this.getTotalMes(), //Valor total das Compras do mes
      this.despesasService.getTotalDespesasHoje(), //Valor total das despesas de Hoje
      this.despesasService.getTotalDespesasMes(), //Valor total das despesas do Mes
      this.prodService.getProdutosEValorMonetario(), //Valor total dos Produtos do estoque e a quantidade total de produtos
      this.getSevenDays(),  //Vendas dos ultimos 7 dias
      this.getProdutosMaisVendidos(),  // Produtos mais vendidos no mes
      this.getProdutosMaisLucrativos(),  // Produtos mais Lucrativos no mes
      this.getProdutosMaisParados(),  // Produtos mais Parados no mes, sem vendas, ou com poucas vendas
      this.getTotalPorCategoria(), // Categorias mais vendidas no mes
      this.getProdutosSemEstoque(), // Produtos Sem Estoque
      this.getVendedores(), // vendedores
      this.getUltimaCompra(), //ultima compra feita
    ]);
    return {
      Financeiro: {
        soma_total_hoje: ValorCompraTotalHoje, 
        soma_total_mes: ValorCompraTotalMes,
        despesas_hoje: ValorDespesasHoje,
        despesas_mes: ValorDespesasMes,
        Lucro_mes: Math.round((ValorCompraTotalMes - ValorDespesasMes) * 100) / 100, // Lucro do mês
      },
      Estoque:{
        Quantidade_produtos_No_Estoque: QuantidadeProdutos,
        Valor_Retido_no_Estoque: ValorDoEstoque,
        Produtos_Sem_Estoque: ProdutosSemEstoque
      },
      Arrays:{
        Vendas_ultimos_7_dias: ArraySevenDays,
        Mais_Vendidos_mes: ProdutosMaisVendidos,
        Mais_Lucrativos_mes: ProdutosMaisLucrativos,
        Mais_Parados_mes: ProdutosMaisParados,
        Compra_Por_Categoria: ValorCompraTotalMesPorCategoria
      },
      Outros:{
        vendedores: TotalVendedores,
        ultima_Compra: ultimaCompra[0]

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

   //Ultima Compra feita
  async getUltimaCompra(): Promise<{total: number, data:String}> {

    const ultimaCompra = await this.comprasRepository.query
    (`select data, total from comprat
      order by data desc
      limit 1`);

    if (!ultimaCompra) {
    return {total: 0, data: ""};
    }

    return ultimaCompra ?? 0;
  }

  

  //Total de vendedores
  async getVendedores(): Promise<number> {

    const vendedores = await this.comprasRepository.query
    (`select count(*) as vendedor from vendedor;`);

    if (!vendedores || vendedores.length === 0) {
    return 0;
  }
    return vendedores[0].vendedor ?? 0;
  }

  //Total de produtos sem estoque
  async getProdutosSemEstoque(): Promise<number> {

    const ProdutosSemEstoque = await this.comprasRepository.query
    (`
      SELECT COUNT(*) AS quantidade_produtos_poucos
      FROM (
          SELECT
              p.codigo,
              p.nome,
              p.quantminimo,
              COALESCE(SUM(hp.quant), 0) AS quantidade_estoque
          FROM Produto p
          LEFT JOIN historicoProd hp
              ON hp.fkproduto = p.codigo
          GROUP BY
              p.codigo,
              p.nome,
              p.quantminimo
          HAVING COALESCE(SUM(hp.quant), 0) <= p.quantminimo
      ) produtos_baixo_estoque;`);

    if (!ProdutosSemEstoque || ProdutosSemEstoque.length === 0) {
    return 0;
  }
    return ProdutosSemEstoque[0].quantidade_produtos_poucos ?? 0;
  }


  //Total por Mes por categoria
  async getTotalPorCategoria(): Promise<[]> {

    const ValorCompraTotalMesPorCategoria = await this.comprasRepository.query
    (`SELECT
    COALESCE(p.categoria, 'Sem categoria') AS categoria,
    ROUND(
        SUM(ic.quant * ic.preco)::numeric,
        2
    ) AS valor_total_vendido,
    ROUND(
        (SUM(ic.quant * ic.preco) / SUM(SUM(ic.quant * ic.preco)) OVER () * 100 )::numeric, 2) AS percentual
        FROM ItemCompra ic
        INNER JOIN CompraT ct
            ON ct.id = ic.fkcomprat
        INNER JOIN historicoProd hp
            ON hp.id = ic.fkhistoricoP
        INNER JOIN Produto p
            ON p.codigo = hp.fkproduto
        WHERE
            ct.data >= DATE_TRUNC('month', CURRENT_DATE)
            AND ct.data < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
        GROUP BY
            COALESCE(p.categoria, 'Sem categoria')
        ORDER BY
            valor_total_vendido DESC
        limit 5;
      `);

    if (!ValorCompraTotalMesPorCategoria || ValorCompraTotalMesPorCategoria.length === 0) {
    return [];
    }

    return ValorCompraTotalMesPorCategoria ?? 0;
  
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

    let ultimosSevenDays = await this.comprasRepository.query
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

    if (!ultimosSevenDays || ultimosSevenDays.length === 0) {
    return [];
  }

  const formatador = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });

  return ultimosSevenDays.map(item => ({
    ...item,
    dia_formatado: formatador.format(new Date(item.dia)).replace('-feira', '')
  }));
  }


   //Produtos mais vendidos no mes
   async getProdutosMaisVendidos(): Promise<[]> {

    const MaisVendidos = await this.comprasRepository.query
    (`SELECT p.nome, CAST(SUM(i.quant) AS DECIMAL(10,2)) AS total_vendido, 
      CAST((i.preco * SUM(i.quant)) AS DECIMAL(10,2)) AS "ValorTotalVendido"
      FROM ItemCompra i
      JOIN historicoprod hist on hist.id = i.fkhistoricop
      JOIN Produto p ON p.codigo = hist.fkproduto
      JOIN CompraT c ON c.id = i.fkCompraT
      WHERE DATE_TRUNC('month', c.data) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY p.nome, i.preco
      ORDER BY total_vendido DESC
      LIMIT 5;
`);

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
	    JOIN historicoprod hist on hist.id = i.fkhistoricop
      JOIN Produto p ON p.codigo = hist.fkProduto
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
      sum(hist.quant) as quant,
      COALESCE(SUM(i.quant), 0) AS total_vendido
      FROM Produto p
	    JOIN historicoprod hist on hist.fkproduto = p.codigo
      LEFT JOIN ItemCompra i ON i.fkhistoricop = hist.id
      LEFT JOIN CompraT c ON c.id = i.fkCompraT
      AND c.data >= CURRENT_DATE - INTERVAL '30 days'
      WHERE hist.quant > 0
      GROUP BY p.codigo, p.nome
      ORDER BY total_vendido ASC 
      LIMIT 5;
      `);

    if (!MaisParados || MaisParados.length === 0) {
    return [];
  }
    return MaisParados ?? 0;
  }


}
