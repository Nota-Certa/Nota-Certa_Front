export type Impostos = {
  IPI: number;
  ICMS: number;
};

export type ItemNotaFiscal = {
  id: string;
  nota_fiscal_id: string;
  descricao: string;
  quantidade: number;
  valor_unitario: string;
  impostos: Impostos;
};

export type NotaFiscal = {
  id: string;
  empresa_id: string;
  documento: string;
  nome_razao_social: string;
  tipo_pessoa: string;
  status: string;
  data_emissao: string;
  data_vencimento: string;
  valor_total: string;
  itens: ItemNotaFiscal[];
};
