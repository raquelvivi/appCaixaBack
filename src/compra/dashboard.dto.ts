export interface DashboardDTO {
  Financeiro: {
    soma_total_hoje: number;
    soma_total_mes: number;
    despesas_hoje: number;
    despesas_mes: number;
    Lucro_mes: number;
  };

  Estoque: {
    Quantidade_produtos_No_Estoque: number;
    Valor_Retido_no_Estoque: number;
  };

  Arrays: {
    Vendas_ultimos_7_dias: any[];
    Mais_Vendidos_mes: any[];
    Mais_Lucrativos_mes: any[];
    Mais_Parados_mes: any[];
  };
}